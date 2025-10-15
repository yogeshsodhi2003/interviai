import React from "react";
import {
  Brain,
  Code,
  Users,
  Zap,
  PlayCircle,
  ArrowRight,
  Clock,
  Shield,
  Star,
  Sparkles,
} from "lucide-react";
import Stat from "./components/home/Stat";
import Feature from "./components/home/Feature";
import FooterCol from "./components/home/FooterCol";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const Home = () => {
  const user = useSelector((state) => state.user);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Top spacer because navbar is fixed */}
      <div className="h-16" />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950">
        {/* Decorative gradients */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-16 -right-16 h-80 w-80 rounded-full bg-indigo-600/20 blur-3xl" />
          <div className="absolute -bottom-16 -left-16 h-80 w-80 rounded-full bg-sky-500/20 blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center py-20">
          {/* Hero copy */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-indigo-200 mb-4">
              <Sparkles className="h-3.5 w-3.5" />
              Powered by AI interviews
            </div>
            <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6 leading-tight tracking-tight">
              Hire better with
              {" "}
              <span className="text-indigo-300">InterviAI</span>
            </h1>
            <p className="text-lg lg:text-xl text-slate-300/90 mb-8">
              AI-powered technical interviews, live coding, and instant evaluations to streamline engineering hiring and practice. 
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link
                to="/interview"
                className="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors inline-flex items-center shadow focus:outline-none focus:ring-2 focus:ring-indigo-300"
              >
                <PlayCircle className="h-5 w-5 mr-2" /> Start Interview
              </Link>
              <button
                className="border border-white/15 text-slate-100 px-6 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors inline-flex items-center focus:outline-none focus:ring-2 focus:ring-white/20"
                onClick={() => {
                  const el = document.getElementById("features");
                  el?.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
              >
                Watch Demo <ArrowRight className="h-5 w-5 ml-2" />
              </button>
            </div>

            {/* Personalized note */}
            <p className="mt-4 text-sm text-slate-400">
              {user?.name
                ? `Welcome back, ${user.name}. Continue where the last interview left off.`
                : "Sign in to save progress and get tailored interview questions."}
            </p>
          </div>

          {/* Hero visual: glass cards skeleton rows */}
          <div className="relative">
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 space-y-4 shadow-xl">
              {[
                { Icon: Brain, color: "bg-indigo-500/80" },
                { Icon: Code, color: "bg-emerald-500/80" },
                { Icon: Users, color: "bg-purple-500/80" },
              ].map(({ Icon, color }, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 group"
                >
                  <div className={`h-12 w-12 ${color} rounded-xl grid place-items-center ring-1 ring-white/10 transition-transform group-hover:scale-105`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="h-3 bg-white/20 rounded w-40 mb-2 group-hover:bg-white/25 transition-colors" />
                    <div className="h-2 bg-white/15 rounded w-28 group-hover:bg-white/20 transition-colors" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-slate-900/60 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 lg:grid-cols-4 gap-6">
          <Stat label="Developers Interviewed" value="5000+" />
          <Stat label="Time Saved" value="85%" />
          <Stat label="Companies" value="200+" />
          <div className="text-center rounded-xl border border-white/10 bg-white/5 p-6">
            <div className="text-3xl lg:text-4xl font-bold text-indigo-300 mb-2 flex items-center justify-center">
              4.9
              <Star className="h-6 w-6 text-yellow-400 fill-yellow-400 ml-2" />
            </div>
            <div className="text-slate-300">User Rating</div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-16 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-3">
              Intelligent Features
            </h2>
            <p className="text-slate-300">
              Everything needed to run fair, scalable technical interviews.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Feature
              icon={<Brain className="h-7 w-7 text-indigo-400" />}
              title="AI Question Generation"
              desc="Role-aware questions tailored to job descriptions and seniority."
            />
            <Feature
              icon={<Code className="h-7 w-7 text-emerald-400" />}
              title="Live Coding"
              desc="Collaborative editor, syntax highlighting, tests and playback."
            />
            <Feature
              icon={<Zap className="h-7 w-7 text-purple-400" />}
              title="Real-time Analysis"
              desc="Instant feedback on correctness, clarity, and problem-solving."
            />
            <Feature
              icon={<Users className="h-7 w-7 text-orange-400" />}
              title="Video Interviews"
              desc="Low-latency video with recording and automatic summaries."
            />
            <Feature
              icon={<Clock className="h-7 w-7 text-rose-400" />}
              title="Smart Scheduling"
              desc="Timezone-aware invites and reminders with calendar links."
            />
            <Feature
              icon={<Shield className="h-7 w-7 text-sky-400" />}
              title="Security"
              desc="GDPR-friendly storage, encrypted transport, role-based access."
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-indigo-600 to-sky-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            Ready to hire faster?
          </h2>
          <p className="text-indigo-100 mb-6">
            Start a free trial and run the first AI-powered interview in minutes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/interview"
              className="bg-white text-indigo-700 px-6 py-3 rounded-lg font-semibold hover:bg-indigo-50 transition-colors shadow focus:outline-none focus:ring-2 focus:ring-white/50"
            >
              Start Free Trial
            </Link>
            <button className="border border-white/40 text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-white/50">
              Schedule Demo
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-3">
              <div className="h-9 w-9 grid place-items-center rounded-lg bg-indigo-500/20 ring-1 ring-white/10 mr-2">
                <Brain className="h-5 w-5 text-indigo-300" />
              </div>
              <span className="text-xl font-bold text-white">InterviAI</span>
            </div>
            <p className="text-slate-400">
              AI for structured, fair, and efficient technical interviews.
            </p>
          </div>

          <FooterCol
            title="Product"
            links={[
              ["#features", "Features"],
              ["#", "Pricing"],
              ["#", "Integrations"],
              ["#", "API"],
            ]}
          />
          <FooterCol
            title="Company"
            links={[
              ["#", "About"],
              ["#", "Blog"],
              ["#", "Careers"],
              ["#", "Contact"],
            ]}
          />
          <FooterCol
            title="Support"
            links={[
              ["#", "Help Center"],
              ["#", "Privacy"],
              ["#", "Terms"],
              ["#", "Security"],
            ]}
          />
        </div>
        <div className="border-t border-white/10 py-6 text-center text-slate-400">
          © {new Date().getFullYear()} InterviAI. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Home;
