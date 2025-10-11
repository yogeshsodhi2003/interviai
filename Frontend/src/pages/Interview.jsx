import { useState, useRef, useEffect } from "react";

import { io } from "socket.io-client";

import LoadingSpinner from "../components/LoadingSpinner"; // Create this component
import ResumeUploader from "../components/ResumeUploader";
import { useSelector } from "react-redux";

export default function InterviewPage() {
  const user = useSelector((state) => state.user);
  console.log(user);

  // 2. All useState hooks
  const [messages, setMessages] = useState([]);
  const [isStarted, setIsStarted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  const [isCandidateSpeaking, setIsCandidateSpeaking] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("the interview has started");

  // 3. Refs after useState
  const recognitionRef = useRef(null);
  const socketRef = useRef(null);

  // 4. Effects after all state declarations
  useEffect(() => {
    if (!user?.userId) return;

    const socket = io(import.meta.env.VITE_SERVER_URL, {
      transports: ["websocket"],
      reconnection: true,
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
    });

    socket.on("aiResponse", (response) => {
      console.log("Received AI response:", response);
      setMessages((prev) => [...prev, { sender: "AI", text: response }]);
      speakText(response);
    });

    socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
      setError("Failed to connect to interview server");
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [user?.userId]);

  useEffect(() => {
    if (!("webkitSpeechRecognition" in window)) {
      setError("Speech recognition is not supported in this browser");
    }
  }, []);

  useEffect(() => {
    navigator.mediaDevices.enumerateDevices().then((devices) => {
      const mic = devices.find(
        (d) => d.kind === "audioinput" && d.label.includes("OPPO")
      );
      if (mic) {
        navigator.mediaDevices
          .getUserMedia({ audio: { deviceId: mic.deviceId } })
          .then((stream) => {
            console.log("Earbuds mic selected");
          })
          .catch((err) => {
            console.error("Failed to select mic:", err);
          });
      } else {
        console.warn("Earbuds mic not found");
      }
    });
  }, []);

  useEffect(() => {
    let stream;

    async function startCamera() {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        const videoElement = document.getElementById("userVideo");
        if (videoElement) {
          videoElement.srcObject = stream;
        }
      } catch (err) {
        console.error("Camera access denied or failed:", err);
        setError("Unable to access camera");
      }
    }

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // 5. Handler functions after effects
  const handleStartInterview = async () => {
    try {
      if (!socketRef.current?.connected) {
        setError("Not connected to interview server");
        return;
      }
      const roomId = user.userId;
      socketRef.current.emit("joinRoom", { roomId });
      setIsStarted(true);
      console.log("room is created");
      socketRef.current.emit("userMessage", {
        roomId: user.userId,
        message: transcript,
        resumeSummary: user.resumeSummary,
      });
      console.log("Initial message sent:", transcript);
    } catch (err) {
      console.error("Error starting interview:", err);
      setError("Failed to start interview");
    }
  };

  // Initialize and start speech recognition
  const startRecording = () => {
    try {
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
        console.log("User said:", transcript);

        // Send to backend and trigger AI response
        socketRef.current.emit("userMessage", {
          roomId: user.userId,
          message: transcript,
          resumeSummary: user.resumeSummary,
        });
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

  // Convert AI response text to speech
  const speakText = (response) => {
    // Create and configure speech synthesis utterance
    const utterance = new SpeechSynthesisUtterance(response);
    utterance.lang = "en-US";
    utterance.voice = speechSynthesis
      .getVoices()
      .find((v) => v.name === "Google US English");
    // When AI finishes speaking, start recording
    utterance.onend = () => {
      console.log("AI finished speaking. Starting recording...");
      startRecording();
    };
    speechSynthesis.speak(utterance);
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
                <video
                  id="userVideo"
                  autoPlay
                  playsInline
                  style={{ width: "300px", borderRadius: "8px" }}
                />

                <button
                  onClick={handleStartInterview}
                  disabled={loading || isStarted}
                  className={`
                    w-full sm:w-auto px-6 py-3 rounded-lg font-medium 
                    transition-all duration-150 ease-in-out
                    ${
                      loading || isStarted
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700 text-white hover:shadow-lg"
                    }
                  `}
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Starting...
                    </span>
                  ) : isStarted ? (
                    "Interview in Progress..."
                  ) : (
                    "Start Your Interview"
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Interview Progress Section */}
          {isStarted && (
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              {isRecording && (
                <div className="flex items-center justify-center space-x-2 text-gray-600">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                  <span>Listening...</span>
                </div>
              )}
              {transcript && (
                <div className="mt-4">
                  <h3 className="font-medium text-gray-900 mb-2">
                    Your Response:
                  </h3>
                  <p className="text-gray-600 bg-gray-50 p-3 rounded">
                    {transcript}
                  </p>
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
            <svg
              className="w-5 h-5 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            {error}
          </p>
        </div>
      )}
    </div>
  );
}
