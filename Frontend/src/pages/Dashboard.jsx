import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { clearUser } from '../features/user/userSlice';
import { useMemo } from 'react';
import { ArrowRight, Upload, LogOut, FileText, History, MessageSquare } from 'lucide-react';

export default function Dashboard() {
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleReupload = () => navigate('/upload-resume');
  const handleLogout = () => {
    localStorage.removeItem('token');
    dispatch(clearUser());
    navigate('/login');
  };

  const initials = useMemo(() => {
    const n = user?.name || '';
    return (
      n
        .split(' ')
        .slice(0, 2)
        .map((s) => s[0]?.toUpperCase())
        .join('') || 'U'
    );
  }, [user?.name]);

  const resumePresent = Boolean(user?.resumeSummary);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 text-slate-100">
      <header className="sticky top-0 z-30 backdrop-blur supports-[backdrop-filter]:bg-slate-900/50 border-b border-white/10">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-indigo-500/20 ring-1 ring-inset ring-white/10 grid place-items-center">
              <span className="text-indigo-300 font-semibold">{initials}</span>
            </div>
            <div className="leading-tight">
              <p className="text-sm text-slate-300">Welcome back</p>
              <h1 className="text-lg font-semibold text-white">{user?.name || 'Candidate'}</h1>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 rounded-lg bg-red-500/90 px-4 py-2 text-white shadow-sm hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-300"
          >
            <LogOut className="h-4 w-4" /> Logout
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 space-y-8">
        {/* Hero / Glass card */}
        <section className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-xl">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(1200px_600px_at_100%_-10%,rgba(67,56,202,0.5),transparent),radial-gradient(800px_400px_at_0%_110%,rgba(14,165,233,0.4),transparent)]" />
          <div className="relative grid gap-6 p-6 sm:p-8 md:grid-cols-3">
            <div className="md:col-span-2">
              <h2 className="text-2xl sm:text-3xl font-semibold text-white">Interview Dashboard</h2>
              <p className="mt-2 text-slate-300">
                Manage the resume, run mock interviews, and review feedback with a professional, streamlined interface built for preparation.
              </p>

              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => navigate('/mock-interview')}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-500 px-4 py-2.5 text-white shadow hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                >
                  Start mock interview <ArrowRight className="h-4 w-4" />
                </button>
                <button
                  onClick={handleReupload}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-white/10 px-4 py-2.5 text-slate-100 ring-1 ring-inset ring-white/15 hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-white/30"
                >
                  <Upload className="h-4 w-4" /> Reupload resume
                </button>
              </div>
            </div>

            {/* Resume status */}
            <div className="rounded-xl border border-white/10 bg-black/20 p-5">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-emerald-300" />
                <h3 className="font-medium text-white">Resume status</h3>
              </div>
              <p className="mt-2 text-sm text-slate-300">
                {resumePresent ? 'Resume uploaded' : 'No resume found'}
              </p>
              <div className="mt-4 text-xs text-slate-400 line-clamp-4">
                {resumePresent
                  ? user.resumeSummary
                  : 'Upload a resume to personalize interview questions and feedback.'}
              </div>
              <div className="mt-4">
                <button
                  onClick={handleReupload}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-md bg-emerald-500/90 px-3 py-2 text-white hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-300"
                >
                  <Upload className="h-4 w-4" />
                  {resumePresent ? 'Update resume' : 'Upload resume'}
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Quick stats + actions */}
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Interviews" value={user?.stats?.interviews || 0} trend="+0 today" />
          <StatCard label="Avg. score" value={user?.stats?.avgScore || 0} suffix="/10" trend="last 7 days" />
          <StatCard label="Feedback" value={user?.stats?.feedback || 0} trend="new comments" />
          <StatCard label="Streak" value={user?.stats?.streak || 0} trend="days practicing" />
        </section>

        {/* Panels */}
        <section className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-5 lg:col-span-2">
            <div className="flex items-center justify-between">
              <h3 className="text-white font-medium flex items-center gap-2">
                <History className="h-5 w-5 text-indigo-300" />
                Recent activity
              </h3>
              <button
                onClick={() => navigate('/history')}
                className="text-sm text-indigo-300 hover:text-indigo-200"
              >
                View all
              </button>
            </div>
            <div className="mt-4 divide-y divide-white/10">
              {(user?.recent || []).slice(0, 5).map((row, idx) => (
                <ActivityRow key={idx} row={row} />
              ))}
              {!(user?.recent || []).length && (
                <div className="rounded-lg border border-white/10 p-4 text-sm text-slate-300">
                  No activity yet. Start a mock interview to see results and feedback here.
                </div>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-5">
            <h3 className="text-white font-medium flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-sky-300" />
              Quick actions
            </h3>
            <div className="mt-4 grid gap-3">
              <ActionButton
                onClick={() => navigate('/practice/dsa')}
                title="Practice DSA round"
                subtitle="Timed 30 min set"
              />
              <ActionButton
                onClick={() => navigate('/practice/system-design')}
                title="System design drill"
                subtitle="10 min prompt"
              />
              <ActionButton
                onClick={() => navigate('/settings')}
                title="Settings"
                subtitle="Audio, STT, TTS, auth"
              />
            </div>
          </div>
        </section>
      </main>

      <footer className="mx-auto max-w-6xl px-4 py-6 text-xs text-slate-400">
        © {new Date().getFullYear()} Interview Prep. All rights reserved.
      </footer>
    </div>
  );
}

function StatCard({ label, value, suffix, trend }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur p-4 hover:bg-white/10 transition-colors">
      <p className="text-xs text-slate-300">{label}</p>
      <div className="mt-1 flex items-baseline gap-1">
        <p className="text-2xl font-semibold text-white">{value}</p>
        {suffix ? <span className="text-slate-400">{suffix}</span> : null}
      </div>
      {trend ? <p className="mt-1 text-xs text-slate-400">{trend}</p> : null}
    </div>
  );
}

function ActivityRow({ row }) {
  return (
    <div className="flex items-center justify-between py-3">
      <div>
        <p className="text-sm text-white">{row?.title || 'Mock interview'}</p>
        <p className="text-xs text-slate-400">{row?.date || '—'} • {row?.tag || 'General'}</p>
      </div>
      <div className="text-sm text-slate-300">
        {typeof row?.score !== 'undefined' ? `Score: ${row.score}/10` : ''}
      </div>
    </div>
  );
}

function ActionButton({ onClick, title, subtitle }) {
  return (
    <button
      onClick={onClick}
      className="w-full rounded-lg border border-white/10 bg-black/20 px-4 py-3 text-left hover:bg-black/30 focus:outline-none focus:ring-2 focus:ring-white/20"
    >
      <p className="text-sm text-white">{title}</p>
      {subtitle ? <p className="text-xs text-slate-400">{subtitle}</p> : null}
    </button>
  );
}
