import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import { useUser } from '@clerk/clerk-react';
import LoadingSpinner from "../components/LoadingSpinner"; // Create this component
import ResumeUploader from "../components/ResumeUploader";
import { useSelector } from "react-redux";

export default function InterviewPage() {
  // 1. User authentication state (must be at the top)
  //const { user, isLoaded } = useUser();
  const user = useSelector((state) => (state.user))
  console.log(user)

  // 2. All useState hooks
  const [messages, setMessages] = useState([]);
  const [isStarted, setIsStarted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  const [isCandidateSpeaking, setIsCandidateSpeaking] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [aiResponse, setAiResponse] = useState("");

  // 3. Refs after useState
  const recognitionRef = useRef(null);
  const socketRef = useRef(null);

  // 4. Effects after all state declarations
  useEffect(() => {
    if (!user) return;

    // // Initialize socket connection
    // socketRef.current = io("http://localhost:3000");
    
    // // Socket event listeners
    // socketRef.current.on("aiResponse", (response) => {
    //   setMessages((prev) => [...prev, { sender: "AI", text: response }]);
    //   speakText(response);
    // });

    // Cleanup function
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [user]);

  useEffect(() => {
    if (!("webkitSpeechRecognition" in window)) {
      setError("Speech recognition is not supported in this browser");
    }
  }, []);

  // 5. Handler functions after effects
  const handleStartInterview = async () => {
    if (!user) {
      setError("Please sign in to start the interview");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await axios.post("http://localhost:3000/api/ask", {
        jobTitle: "webdeveloper",
        userId: user.id
      });

      const roomId = response.data.roomId || "webdeveloper";
      socketRef.current?.emit("joinRoom", { roomId });
      setIsStarted(true);
    } catch (err) {
      setError(err?.message || "Failed to start interview");
    } finally {
      setLoading(false);
    }
  };

  // Initialize and start speech recognition
  const startRecording = () => {
    try {
      setIsCandidateSpeaking(true);
      const recognition = new window.webkitSpeechRecognition();
      recognitionRef.current = recognition;

      // Configure speech recognition settings
      recognition.lang = "en-US";
      recognition.continuous = false; // Stop after single recognition
      recognition.interimResults = false; // Only return final results

      // Event handler when recording begins
      recognition.onstart = () => {
        setIsRecording(true);
        setError("");
        console.log("Recording started...");
      };

      // Event handler for speech recognition results
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setTranscript(transcript);
        sendTranscriptToBackend(transcript);
        console.log(transcript);
      };

      // Event handler for recognition errors
      recognition.onerror = (event) => {
        setError(`Recording error: ${event.error}`);
        setIsRecording(false);
      };

      // Event handler when recording ends
      recognition.onend = () => {
        setIsRecording(false);
        console.log("Recording ended");
      };

      recognition.start();
    } catch (err) {
      setError("Failed to start recording");
      setIsRecording(false);
    }
  };

  // Stop the speech recognition process
  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  // Send recorded transcript to backend for AI processing
  const sendTranscriptToBackend = async (text) => {
    try {
      const response = await axios.post("http://localhost:3000/api/audio", {
        transcript: text,
      });
      console.log("data reivce:", response.data.text);
      setAiResponse(response.data.text);
      speakText(response.data.text);
    } catch (err) {
      setError(err.message || "Failed to send transcript");
    }
  };

  // Convert AI response text to speech
  const speakText = (aiResponse) => {
    // Create and configure speech synthesis utterance
    const utterance = new SpeechSynthesisUtterance(aiResponse);
    utterance.lang = "en-US";
    utterance.voice = speechSynthesis
      .getVoices()
      .find((v) => v.name === "Google US English");
    speechSynthesis.speak(utterance);
    startRecording(); // Start recording after AI finishes speaking
  };

  // 6. Early return for loading state
  if (!user.name) {
    return <LoadingSpinner />;
  }

  // 7. Main render with updated UI
  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">AI Interview Assistant</h1>
      
      {user ? (
        <div className="space-y-6">
          {/* Welcome Card */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Welcome, {user.name || user.username}
            </h2>
            <p className="mt-2 text-gray-600">
              {!user.resumeSummary 
                ? "Please upload your resume to begin the interview process."
                : "Your resume is ready. You can start your interview now."}
            </p>
          </div>

          {/* Action Card */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            {!user.resumeSummary ? (
              /* Resume Upload Section */
              <div className="text-center">
                <div className="mb-4">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 48 48"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M8 14v20c0 4.418 3.582 8 8 8h16c4.418 0 8-3.582 8-8V14M8 14c0-4.418 3.582-8 8-8h16c4.418 0 8 3.582 8 8M8 14h32"
                    />
                  </svg>
                </div>
                <ResumeUploader userId={user.id} />
              </div>
            ) : (
              /* Interview Start Section */
              <div className="text-center">
                <button
                  onClick={handleStartInterview}
                  disabled={loading || isStarted}
                  className={`
                    w-full sm:w-auto px-6 py-3 rounded-lg font-medium 
                    transition-all duration-150 ease-in-out
                    ${loading || isStarted
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700 text-white hover:shadow-lg"
                    }
                  `}
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Starting...
                    </span>
                  ) : isStarted ? (
                    "Interview Started"
                  ) : (
                    "Start Your Interview"
                  )}
                </button>

                {isStarted && (
                  <div className="mt-6">
                    <button
                      onClick={isRecording ? stopRecording : startRecording}
                      className={`
                        px-6 py-3 rounded-lg font-medium
                        transition-all duration-150 ease-in-out
                        ${isRecording
                          ? "bg-red-600 hover:bg-red-700 text-white"
                          : "bg-green-600 hover:bg-green-700 text-white"
                        }
                      `}
                    >
                      {isRecording ? (
                        <span className="flex items-center">
                          <span className="animate-pulse mr-2 h-3 w-3 rounded-full bg-red-200"></span>
                          Stop Recording
                        </span>
                      ) : (
                        "Start Recording"
                      )}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Interview Progress Section */}
          {isStarted && (
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              {transcript && (
                <div className="mb-4">
                  <h3 className="font-medium text-gray-900 mb-2">Your Response:</h3>
                  <p className="text-gray-600 bg-gray-50 p-3 rounded">{transcript}</p>
                </div>
              )}

              {aiResponse && (
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">AI Response:</h3>
                  <p className="text-gray-600 bg-gray-50 p-3 rounded mb-3">{aiResponse}</p>
                  <button
                    onClick={() => speakText(aiResponse)}
                    className="inline-flex items-center px-4 py-2 rounded-lg font-medium bg-purple-600 hover:bg-purple-700 text-white transition-colors duration-150"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                    </svg>
                    Play Response
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-10 bg-white rounded-lg shadow-sm">
          <p className="text-gray-600">Please sign in to start the interview</p>
        </div>
      )}

      {error && (
        <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-lg border border-red-200">
          <p className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            {error}
          </p>
        </div>
      )}
    </div>
  );
}
