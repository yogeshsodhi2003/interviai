import { useState, useRef, useEffect } from "react";
import { io } from "socket.io-client";
import { useSelector } from "react-redux";
import LoadingSpinner from "../components/LoadingSpinner";
import ResumeUploader from "../components/ResumeUploader";
// Optional: swap with your icon set
import { Mic, Square, Video, Play, AlertTriangle, CheckCircle2, Bot, User as UserIcon } from "lucide-react";

export default function InterviewPage() {
  const user = useSelector((state) => state.user);

  // Conversation + UI state
  const [messages, setMessages] = useState([]);            // { sender: "AI" | "YOU", text: string }
  const [isStarted, setIsStarted] = useState(false);
  const [loading, setLoading] = useState(false);           // starting the session
  const [error, setError] = useState("");
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  const [isCandidateSpeaking, setIsCandidateSpeaking] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("the interview has started");

  // Refs for media + sockets
  const recognitionRef = useRef(null);
  const socketRef = useRef(null);
  const currentUtteranceRef = useRef(null);
  const videoStreamRef = useRef(null);

  // Socket connection
  useEffect(() => {
    if (!user?.userId) return;

    const socket = io(import.meta.env.VITE_SERVER_URL, {
      transports: ["websocket"],
      reconnection: true,
      // Tip: include auth if using JWT: auth: { token: yourToken }
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      // Connected to interview server
      // console.log("Socket connected:", socket.id);
      setError("");
    });

    socket.on("aiResponse", (response) => {
      setMessages((prev) => [...prev, { sender: "AI", text: response }]);
      speakText(response);
    });

    socket.on("connect_error", (err) => {
      setError("Failed to connect to interview server");
      // console.error(err);
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [user?.userId]);

  // STT support check
  useEffect(() => {
    if (!("webkitSpeechRecognition" in window)) {
      setError("Speech recognition is not supported in this browser");
    }
  }, []);

  // Prefer a known mic if available (example: OPPO earbuds)
  useEffect(() => {
    navigator.mediaDevices?.enumerateDevices?.().then((devices) => {
      const mic = devices.find(
        (d) => d.kind === "audioinput" && (d.label || "").includes("OPPO")
      );
      if (mic) {
        navigator.mediaDevices
          .getUserMedia({ audio: { deviceId: mic.deviceId } })
          .then(() => {
            // console.log("Earbuds mic selected");
          })
          .catch(() => {
            // fail silently, user can still speak with default mic
          });
      }
    });
  }, []);

  // Camera preview
  useEffect(() => {
    let stream;
    async function startCamera() {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        videoStreamRef.current = stream;
        const videoElement = document.getElementById("userVideo");
        if (videoElement) videoElement.srcObject = stream;
      } catch (err) {
        setError("Unable to access camera");
      }
    }
    startCamera();

    return () => {
      if (videoStreamRef.current) {
        videoStreamRef.current.getTracks().forEach((t) => t.stop());
        videoStreamRef.current = null;
      }
    };
  }, []);

  // Start interview: join room and send initial message
  const handleStartInterview = async () => {
    try {
      if (!socketRef.current?.connected) {
        setError("Not connected to interview server");
        return;
      }
      setLoading(true);
      const roomId = user.userId;
      socketRef.current.emit("joinRoom", { roomId });
      setIsStarted(true);
      setMessages((prev) => [...prev, { sender: "YOU", text: transcript }]);
      socketRef.current.emit("userMessage", {
        roomId: user.userId,
        message: transcript,
        resumeSummary: user.resumeSummary,
      });
    } catch (err) {
      setError("Failed to start interview");
    } finally {
      setLoading(false);
    }
  };

  // Initialize and start speech recognition
  const startRecording = () => {
    // Stop any current AI speech before listening to avoid overlap
    stopSpeaking();

    try {
      const recognition = new window.webkitSpeechRecognition();
      recognitionRef.current = recognition;

      recognition.lang = "en-US";
      recognition.continuous = false; // speak-turn based
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsRecording(true);
        setIsCandidateSpeaking(true);
        setError("");
      };

      recognition.onresult = (event) => {
        const t = event.results[0][0].transcript;
        setTranscript(t);
        setMessages((prev) => [...prev, { sender: "YOU", text: t }]);

        // Send to backend and trigger AI response
        socketRef.current?.emit("userMessage", {
          roomId: user.userId,
          message: t,
          resumeSummary: user.resumeSummary,
        });
      };

      recognition.onerror = (event) => {
        setError(event?.error ? `Recording error: ${event.error}` : "Recording error");
        setIsRecording(false);
        setIsCandidateSpeaking(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
        setIsCandidateSpeaking(false);
      };

      recognition.start();
    } catch {
      setError("Failed to start recording");
      setIsRecording(false);
      setIsCandidateSpeaking(false);
    }
  };

  const stopRecording = () => {
    try {
      recognitionRef.current?.stop?.();
    } catch {
      // ignore
    }
  };

  // Convert AI response text to speech
  const speakText = (response) => {
    // Cancel any current speech
    stopSpeaking();

    const utterance = new SpeechSynthesisUtterance(response);
    currentUtteranceRef.current = utterance;

    utterance.lang = "en-US";
    // Prefer a clear, neutral voice if available
    const voices = window.speechSynthesis.getVoices();
    const preferred =
      voices.find((v) => v.name === "Google US English") ||
      voices.find((v) => v.lang?.toLowerCase().startsWith("en"));
    if (preferred) utterance.voice = preferred;

    utterance.onstart = () => setIsAiSpeaking(true);
    utterance.onend = () => {
      setIsAiSpeaking(false);
      // Automatically hand turn to candidate
      startRecording();
    };
    utterance.onerror = () => setIsAiSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    try {
      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
      }
      currentUtteranceRef.current = null;
      setIsAiSpeaking(false);
    } catch {
      // ignore
    }
  };

  // Graceful loading for missing user
  if (!user?.name) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 text-slate-100 grid place-items-center px-4">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 text-slate-100">
      {/* Top bar */}
      <header className="sticky top-0 z-30 backdrop-blur supports-[backdrop-filter]:bg-slate-900/50 border-b border-white/10">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-indigo-500/20 ring-1 ring-inset ring-white/10 grid place-items-center">
              <UserIcon className="h-4 w-4 text-indigo-300" />
            </div>
            <div className="leading-tight">
              <p className="text-sm text-slate-300">Interview Assistant</p>
              <h1 className="text-lg font-semibold text-white">{user?.name || "Candidate"}</h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <StatusChip
              label={isStarted ? "In session" : "Idle"}
              color={isStarted ? "emerald" : "slate"}
              icon={isStarted ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Bot className="h-3.5 w-3.5" />}
            />
            {isRecording ? (
              <StatusChip label="Listening" color="rose" icon={<Mic className="h-3.5 w-3.5" />} />
            ) : isAiSpeaking ? (
              <StatusChip label="Speaking" color="indigo" icon={<Bot className="h-3.5 w-3.5" />} />
            ) : null}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 space-y-8">
        {/* Welcome / Context card */}
        <section className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-xl">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(1200px_600px_at_100%_-10%,rgba(67,56,202,0.5),transparent),radial-gradient(800px_400px_at_0%_110%,rgba(14,165,233,0.4),transparent)]" />
          <div className="relative grid gap-6 p-6 sm:p-8 md:grid-cols-3">
            <div className="md:col-span-2">
              <h2 className="text-2xl sm:text-3xl font-semibold text-white">AI Interview</h2>
              <p className="mt-2 text-slate-300">
                Speak naturally; the assistant will ask one question at a time, then listen after it finishes speaking. Ensure mic and camera permissions are granted for the best experience.
              </p>

              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                {!user?.resumeSummary ? (
                  <div className="rounded-lg border border-amber-400/30 bg-amber-500/10 text-amber-100 px-3 py-2 text-sm inline-flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    Please upload a resume to personalize your interview.
                  </div>
                ) : (
                  <div className="rounded-lg border border-emerald-400/30 bg-emerald-500/10 text-emerald-100 px-3 py-2 text-sm inline-flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4" />
                    Resume loaded. Ready to start.
                  </div>
                )}
              </div>
            </div>

            {/* Camera preview + start controls */}
            <div className="rounded-xl border border-white/10 bg-black/20 p-5">
              <div className="flex items-center justify-between">
                <p className="font-medium text-white flex items-center gap-2">
                  <Video className="h-5 w-5 text-indigo-300" />
                  Camera preview
                </p>
              </div>

              <div className="mt-3">
                <video id="userVideo" autoPlay playsInline className="w-full rounded-lg" />
              </div>

              <div className="mt-4 grid gap-2">
                {!user?.resumeSummary ? (
                  <ResumeUploader userId={user?.userId} />
                ) : (
                  <button
                    onClick={handleStartInterview}
                    disabled={loading || isStarted}
                    className={`w-full inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-white shadow transition
                      ${loading || isStarted ? "bg-slate-600 cursor-not-allowed" : "bg-indigo-500 hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-300"}`}
                  >
                    {loading ? (
                      <>
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/70 border-t-transparent" />
                        Starting…
                      </>
                    ) : isStarted ? (
                      "Interview in progress…"
                    ) : (
                      <>
                        <Play className="h-4 w-4" />
                        Start interview
                      </>
                    )}
                  </button>
                )}

                {/* Manual controls for demo/debug */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={startRecording}
                    disabled={!isStarted || isRecording || isAiSpeaking}
                    className="flex-1 rounded-md border border-white/10 bg-white/10 px-3 py-2 text-sm hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-white/30 disabled:opacity-50"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <Mic className="h-4 w-4" />
                      Start speaking
                    </div>
                  </button>
                  <button
                    onClick={() => {
                      stopRecording();
                      stopSpeaking();
                    }}
                    className="flex-1 rounded-md border border-white/10 bg-white/10 px-3 py-2 text-sm hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-white/30"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <Square className="h-4 w-4" />
                      Stop
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Conversation + Transcript */}
        {isStarted && (
          <section className="grid gap-6 lg:grid-cols-3">
            {/* Chat transcript */}
            <div className="lg:col-span-2 rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-5">
              <h3 className="text-white font-medium">Conversation</h3>
              <div className="mt-4 space-y-3 max-h-[380px] overflow-auto pr-1">
                {messages.length === 0 ? (
                  <div className="rounded-lg border border-white/10 p-4 text-sm text-slate-300">
                    The interview will appear here. After the assistant speaks, the mic will activate for a reply.
                  </div>
                ) : (
                  messages.map((m, i) => (
                    <ChatBubble key={i} sender={m.sender} text={m.text} />
                  ))
                )}
              </div>
            </div>

            {/* Current response panel */}
            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-5">
              <h3 className="text-white font-medium">Your response</h3>
              <div className="mt-3 rounded-lg border border-white/10 bg-black/20 p-3 text-slate-200 min-h-[80px]">
                {transcript || "Say something to begin…"}
              </div>

              {/* Live status */}
              <div className="mt-4 text-sm text-slate-300">
                <p className="flex items-center gap-2">
                  {isRecording ? (
                    <>
                      <span className="inline-block w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
                      Listening…
                    </>
                  ) : isAiSpeaking ? (
                    <>
                      <span className="inline-block w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse" />
                      Assistant speaking…
                    </>
                  ) : (
                    <>
                      <span className="inline-block w-2.5 h-2.5 rounded-full bg-slate-500" />
                      Idle
                    </>
                  )}
                </p>
              </div>
            </div>
          </section>
        )}

        {/* Error banner */}
        {error && (
          <div className="rounded-lg border border-red-500/30 bg-red-500/10 text-red-200 px-4 py-3 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            <span className="text-sm">{error}</span>
          </div>
        )}
      </main>

      <footer className="mx-auto max-w-6xl px-4 py-6 text-xs text-slate-400">
        Tips: Use headphones, speak clearly, and pause after the assistant finishes speaking.
      </footer>
    </div>
  );
}

/* ========== UI Subcomponents ========== */

// Status chip
function StatusChip({ label, color = "slate", icon }) {
  const colors = {
    slate: "bg-white/10 text-slate-200 border-white/10",
    emerald: "bg-emerald-500/10 text-emerald-200 border-emerald-400/30",
    indigo: "bg-indigo-500/10 text-indigo-200 border-indigo-400/30",
    rose: "bg-rose-500/10 text-rose-200 border-rose-400/30",
  };
  const cls = colors[color] || colors.slate;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-lg border px-2 py-1 text-xs ${cls}`}>
      {icon}
      {label}
    </span>
  );
}

// Chat bubble
function ChatBubble({ sender, text }) {
  const isAI = sender === "AI";
  return (
    <div className={`flex ${isAI ? "justify-start" : "justify-end"}`}>
      <div
        className={`max-w-[85%] rounded-xl border px-3 py-2 text-sm ${
          isAI
            ? "bg-white/5 border-white/10 text-slate-100"
            : "bg-indigo-500/20 border-indigo-400/30 text-indigo-50"
        }`}
      >
        <p className="text-[11px] uppercase tracking-wide opacity-70 mb-1">
          {isAI ? "Assistant" : "You"}
        </p>
        <p className="leading-relaxed">{text}</p>
      </div>
    </div>
  );
}
