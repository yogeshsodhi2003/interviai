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
} from "lucide-react";
import Stat from "./components/home/Stat";
import Feature from "./components/home/Feature";
import FooterCol from "./components/home/FooterCol";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
const Home = () => {
  const user = useSelector((state) => state.user);
  console.log(user); // or user.resumeSummary
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="pt-24 pb-16 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left">
            <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Hire better with <span className="text-blue-200">InterviAI</span>
            </h1>
            <p className="text-lg lg:text-xl text-blue-100 mb-8">
              AI-powered technical interviews, live coding, and instant
              evaluations to streamline engineering hiring.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link to="/interview" className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center shadow">
                <PlayCircle className="h-5 w-5 mr-2" /> Start Interview
              </Link>
              <button className="border-2 border-blue-200 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors inline-flex items-center">
                Watch Demo <ArrowRight className="h-5 w-5 ml-2" />
              </button>
            </div>
          </div>
          <div className="relative">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 space-y-4">
              {[
                { Icon: Brain, color: "bg-blue-400" },
                { Icon: Code, color: "bg-green-400" },
                { Icon: Users, color: "bg-purple-400" },
              ].map(({ Icon, color }, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <div
                    className={`h-12 w-12 ${color} rounded-full flex items-center justify-center animate-pulse`}
                  >
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="h-3 bg-white/40 rounded w-32 mb-2" />
                    <div className="h-2 bg-white/30 rounded w-24" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 lg:grid-cols-4 gap-8">
          <Stat label="Developers Interviewed" value="5000+" />
          <Stat label="Time Saved" value="85%" />
          <Stat label="Companies" value="200+" />
          <div className="text-center">
            <div className="text-3xl lg:text-4xl font-bold text-blue-600 mb-2 flex items-center justify-center">
              4.9
              <Star className="h-6 w-6 text-yellow-400 fill-yellow-400 ml-1" />
            </div>
            <div className="text-gray-600">User Rating</div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
              Intelligent Features
            </h2>
            <p className="text-gray-600">
              Everything needed to run fair, scalable technical interviews.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Feature
              icon={<Brain className="h-7 w-7 text-blue-600" />}
              title="AI Question Generation"
              desc="Role-aware questions tailored to job descriptions and seniority."
            />
            <Feature
              icon={<Code className="h-7 w-7 text-green-600" />}
              title="Live Coding"
              desc="Collaborative editor, syntax highlighting, tests and playback."
            />
            <Feature
              icon={<Zap className="h-7 w-7 text-purple-600" />}
              title="Real-time Analysis"
              desc="Instant feedback on correctness, clarity, and problem-solving."
            />
            <Feature
              icon={<Users className="h-7 w-7 text-orange-600" />}
              title="Video Interviews"
              desc="Low-latency video with recording and automatic summaries."
            />
            <Feature
              icon={<Clock className="h-7 w-7 text-red-600" />}
              title="Smart Scheduling"
              desc="Timezone-aware invites and reminders with calendar links."
            />
            <Feature
              icon={<Shield className="h-7 w-7 text-indigo-600" />}
              title="Security"
              desc="GDPR-friendly storage, encrypted transport, role-based access."
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-blue-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            Ready to hire faster?
          </h2>
          <p className="text-blue-100 mb-6">
            Start a free trial and run the first AI-powered interview in
            minutes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors shadow">
              Start Free Trial
            </button>
            <button className="border-2 border-blue-200 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
              Schedule Demo
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-3">
              <Brain className="h-7 w-7 text-blue-400 mr-2" />
              <span className="text-xl font-bold">InterviAI</span>
            </div>
            <p className="text-gray-400">
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
        <div className="border-t border-gray-800 mt-8 pt-6 text-center text-gray-400">
          © 2025 InterviAI. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Home;
