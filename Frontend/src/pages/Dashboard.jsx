import React from 'react';
import { Brain, Users, Calendar, BarChart3, Plus, Settings, Search, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';

// Dashboard layout with summary cards, upcoming interviews, recent candidates, and performance charts placeholder
const Dashboard = () => {
  const summary = [
    { label: 'Scheduled Interviews', value: 12, icon: Calendar, color: 'bg-blue-50 text-blue-700', chip: '+3 today' },
    { label: 'Candidates in Pipeline', value: 48, icon: Users, color: 'bg-purple-50 text-purple-700', chip: '8 new' },
    { label: 'Average Score', value: '78%', icon: BarChart3, color: 'bg-green-50 text-green-700', chip: '↑ 4% wk' },
    { label: 'AI Questions Used', value: 214, icon: Brain, color: 'bg-indigo-50 text-indigo-700', chip: 'this month' },
  ];

  const upcoming = [
    { time: '10:00 AM', role: 'Frontend Engineer', candidate: 'Anjali Verma', status: 'Scheduled' },
    { time: '11:30 AM', role: 'Backend Engineer', candidate: 'Rohit Sharma', status: 'Scheduled' },
    { time: '2:00 PM', role: 'Fullstack Developer', candidate: 'Meera Iyer', status: 'Pending' },
  ];

  const recent = [
    { name: 'Arjun Mehta', role: 'Frontend Engineer', score: 86, stage: 'Shortlisted' },
    { name: 'Priya Nair', role: 'Data Engineer', score: 73, stage: 'Reviewed' },
    { name: 'Kunal Singh', role: 'Backend Engineer', score: 64, stage: 'Needs follow-up' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="border-b bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-blue-600 flex items-center justify-center">
              <Brain className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
              <p className="text-sm text-gray-500">Welcome back to InterviAI</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center bg-gray-100 rounded-lg px-3">
              <Search className="h-4 w-4 text-gray-500" />
              <input placeholder="Search candidates, roles..." className="bg-transparent px-2 py-2 outline-none text-sm" />
            </div>
            <button className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium">
              <Plus className="h-4 w-4" /> New Interview
            </button>
            <button className="inline-flex items-center gap-2 border px-3 py-2 rounded-lg text-sm hover:bg-gray-50">
              <Settings className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Summary cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {summary.map((s) => (
            <div key={s.label} className="bg-white rounded-xl shadow-sm border p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-500">{s.label}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{s.value}</p>
                </div>
                <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${s.color}`}>
                  <s.icon className="h-5 w-5" />
                </div>
              </div>
              <div className="mt-4 text-xs text-gray-500">{s.chip}</div>
            </div>
          ))}
        </div>

        {/* Main grid */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Upcoming interviews */}
          <div className="bg-white rounded-xl shadow-sm border p-5 lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Upcoming Interviews</h2>
              <button className="text-sm text-blue-600 hover:underline">View calendar</button>
            </div>
            <div className="divide-y">
              {upcoming.map((u, i) => (
                <div key={i} className="py-3 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 font-semibold">
                      {u.time}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{u.role}</p>
                      <p className="text-sm text-gray-500">{u.candidate}</p>
                    </div>
                  </div>
                  <span className={`text-xs px-2.5 py-1 rounded-full border ${u.status === 'Scheduled' ? 'text-green-700 bg-green-50 border-green-200' : 'text-yellow-700 bg-yellow-50 border-yellow-200'}`}>
                    {u.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Performance snapshot */}
          <div className="bg-white rounded-xl shadow-sm border p-5">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Performance Snapshot</h2>
            <div className="space-y-3">
              <Metric label="Average time to hire" value="6.4 days" trend="-0.8 days" positive />
              <Metric label="Offer acceptance rate" value="72%" trend="+3%" positive />
              <Metric label="Interview completion" value="92%" trend="-1%" />
              <Metric label="False negatives (est.)" value="4%" trend="-0.5%" positive />
            </div>
            <div className="mt-5">
              <div className="h-28 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 border flex items-center justify-center text-sm text-gray-500">
                Chart placeholder (connect analytics)
              </div>
            </div>
          </div>
        </div>

        {/* Recent candidates */}
        <div className="mt-6 bg-white rounded-xl shadow-sm border p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Candidates</h2>
            <button className="text-sm text-blue-600 hover:underline">View all</button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left">
              <thead>
                <tr className="text-xs uppercase text-gray-500">
                  <th className="py-2 pr-6">Name</th>
                  <th className="py-2 pr-6">Role</th>
                  <th className="py-2 pr-6">Score</th>
                  <th className="py-2 pr-6">Stage</th>
                  <th className="py-2 pr-6">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {recent.map((c, i) => (
                  <tr key={i} className="text-sm">
                    <td className="py-3 pr-6 font-medium text-gray-900">{c.name}</td>
                    <td className="py-3 pr-6 text-gray-600">{c.role}</td>
                    <td className="py-3 pr-6">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${c.score >= 80 ? 'bg-green-50 text-green-700' : c.score >= 70 ? 'bg-yellow-50 text-yellow-700' : 'bg-red-50 text-red-700'}`}>
                        {c.score}
                      </span>
                    </td>
                    <td className="py-3 pr-6 text-gray-600">{c.stage}</td>
                    <td className="py-3 pr-6">
                      <button className="text-blue-600 hover:underline">View</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

const Metric = ({ label, value, trend, positive }) => (
  <div className="flex items-center justify-between">
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-lg font-semibold text-gray-900">{value}</p>
    </div>
    <div className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full ${positive ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'}`}>
      {positive ? <CheckCircle2 className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />} {trend}
    </div>
  </div>
);

export default Dashboard;
