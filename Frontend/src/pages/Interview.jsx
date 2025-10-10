import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import { useUser } from '@clerk/clerk-react';
import LoadingSpinner from "../components/LoadingSpinner"; // Create this component
import ResumeUploader from "../components/ResumeUploader";

export default function InterviewPage() {
  // 1. User authentication state (must be at the top)
  const { user, isLoaded } = useUser();

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
    if (!isLoaded) return;

    // Initialize socket connection
    socketRef.current = io("http://localhost:3000");
    
    // Socket event listeners
    socketRef.current.on("aiResponse", (response) => {
      setMessages((prev) => [...prev, { sender: "AI", text: response }]);
      speakText(response);
    });

    // Cleanup function
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [isLoaded]);

  useEffect(() => {
    if (!("webkitSpeechRecognition" in window)) {
      setError("Speech recognition is not supported in this browser");
    }
  }, []);

  // 5. Handler functions after effects
  const handleStartInterview = async () => {
    if (!isLoaded || !user) {
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
  if (!isLoaded) {
    return <LoadingSpinner />;
  }

  // 7. Main render
  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Start Interview</h1>
      
      {user ? (
        <>
          <ResumeUploader userId={user.id} />

          <div className="mt-6">
            <h2 className="text-lg font-semibold mb-2">
              Welcome, {user.firstName || user.username}
            </h2>
            
            <button
              onClick={handleStartInterview}
              disabled={loading || isStarted}
              className={`px-4 py-2 rounded font-medium ${
                loading || isStarted
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            >
              {loading ? "Starting..." : isStarted ? "Interview Started" : "Start Interview"}
            </button>

            {isStarted && (
              <button
                onClick={isRecording ? stopRecording : startRecording}
                className={`ml-4 px-4 py-2 rounded font-medium ${
                  isRecording
                    ? "bg-red-600 hover:bg-red-700 text-white"
                    : "bg-green-600 hover:bg-green-700 text-white"
                }`}
              >
                {isRecording ? "Stop Recording" : "Start Recording"}
              </button>
            )}
          </div>

          {/* Voice recording controls and transcript display */}
          <div className="mt-6">
            {transcript && (
              <div className="mt-4 p-3 bg-gray-50 rounded">
                <p className="font-medium">Transcript:</p>
                <p className="mt-1">{transcript}</p>
              </div>
            )}
          </div>

          {/* AI response playback button */}
          <div className="mt-4">
            <button
              onClick={() => speakText(aiResponse)}
              className="px-4 py-2 rounded font-medium bg-purple-600 hover:bg-purple-700 text-white"
            >
              Play AI Response
            </button>
          </div>
        </>
      ) : (
        <div className="text-center py-10">
          <p className="text-gray-600">Please sign in to start the interview</p>
        </div>
      )}

      {/* Error and success message displays */}
      {error && (
        <div className="mt-4 p-3 bg-red-50 text-red-600 rounded">
          {error}
        </div>
      )}
    </div>
  );
}
