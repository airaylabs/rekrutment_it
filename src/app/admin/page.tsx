'use client';

import { useState, useEffect } from 'react';

interface ApplicantDetail {
  soal1?: number;
  soal2?: number;
  soal3?: number;
  soal4?: number;
  soal5?: number;
  multiProject?: number;
  learning?: number;
  initiative?: number;
  team?: number;
  change?: number;
}

interface Applicant {
  id: string;
  timestamp: string;
  nama: string;
  email: string;
  whatsapp: string;
  cvUrl: string;
  cvFileName?: string;
  technicalScore: number;
  technicalDetail?: ApplicantDetail;
  psikotesScore: number;
  psikotesDetail?: ApplicantDetail;
  overallScore: number;
  status: string;
}

const ADMIN_PASSWORD = 'raycorp2026';

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<'all' | 'pass' | 'fail'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'score'>('date');
  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      loadApplicants();
    }
  }, [isAuthenticated]);

  const loadApplicants = async () => {
    setLoading(true);
    try {
      // Try API first
      const response = await fetch('/api/applicants');
      const data = await response.json();
      if (data.success && data.data.length > 0) {
        setApplicants(data.data);
      } else {
        // Fallback to localStorage
        const stored = localStorage.getItem('raycorp_applicants');
        if (stored) {
          setApplicants(JSON.parse(stored));
        }
      }
    } catch (error) {
      // Fallback to localStorage
      const stored = localStorage.getItem('raycorp_applicants');
      if (stored) {
        setApplicants(JSON.parse(stored));
      }
    }
    setLoading(false);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
    } else {
      alert('Password salah!');
    }
  };

  const filteredApplicants = applicants
    .filter(a => {
      if (filter === 'pass') return a.overallScore >= 8;
      if (filter === 'fail') return a.overallScore < 8;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'score') return b.overallScore - a.overallScore;
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    });

  const stats = {
    total: applicants.length,
    pass: applicants.filter(a => a.overallScore >= 8).length,
    fail: applicants.filter(a => a.overallScore < 8).length,
    avgScore: applicants.length > 0 
      ? (applicants.reduce((sum, a) => sum + a.overallScore, 0) / applicants.length).toFixed(1)
      : '0'
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="card p-8 max-w-md w-full">
          <h1 className="text-2xl font-bold text-white mb-2 text-center">
            <span className="text-blue-400">RAY</span>CORP Admin
          </h1>
          <p className="text-gray-400 text-center mb-6">Recruitment Dashboard</p>
          
          <form onSubmit={handleLogin}>
            <input
              type="password"
              className="form-input mb-4"
              placeholder="Masukkan password admin"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit" className="btn-primary w-full">
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">
            <span className="text-blue-400">RAY</span>CORP Recruitment Dashboard
          </h1>
          <p className="text-gray-400">IT Staff Developer Applications</p>
        </div>
        <div className="flex gap-2">
          <button onClick={loadApplicants} className="btn-secondary text-sm">
            🔄 Refresh
          </button>
          <button onClick={() => setIsAuthenticated(false)} className="btn-secondary text-sm">
            Logout
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="card p-4 text-center">
          <p className="text-3xl font-bold text-white">{stats.total}</p>
          <p className="text-gray-400 text-sm">Total Pelamar</p>
        </div>
        <div className="card p-4 text-center">
          <p className="text-3xl font-bold text-green-400">{stats.pass}</p>
          <p className="text-gray-400 text-sm">Score ≥ 8</p>
        </div>
        <div className="card p-4 text-center">
          <p className="text-3xl font-bold text-yellow-400">{stats.fail}</p>
          <p className="text-gray-400 text-sm">Score &lt; 8</p>
        </div>
        <div className="card p-4 text-center">
          <p className="text-3xl font-bold text-blue-400">{stats.avgScore}</p>
          <p className="text-gray-400 text-sm">Rata-rata Score</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg text-sm ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-slate-700 text-gray-300'}`}
          >
            Semua ({stats.total})
          </button>
          <button
            onClick={() => setFilter('pass')}
            className={`px-4 py-2 rounded-lg text-sm ${filter === 'pass' ? 'bg-green-600 text-white' : 'bg-slate-700 text-gray-300'}`}
          >
            Score ≥ 8 ({stats.pass})
          </button>
          <button
            onClick={() => setFilter('fail')}
            className={`px-4 py-2 rounded-lg text-sm ${filter === 'fail' ? 'bg-yellow-600 text-white' : 'bg-slate-700 text-gray-300'}`}
          >
            Score &lt; 8 ({stats.fail})
          </button>
        </div>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as 'date' | 'score')}
          className="form-select w-auto"
        >
          <option value="date">Urutkan: Terbaru</option>
          <option value="score">Urutkan: Score Tertinggi</option>
        </select>
      </div>

      {/* Loading */}
      {loading && (
        <div className="card p-12 text-center">
          <p className="text-gray-400">Loading...</p>
        </div>
      )}

      {/* Table */}
      {!loading && filteredApplicants.length === 0 ? (
        <div className="card p-12 text-center">
          <p className="text-gray-400 text-lg">Belum ada data pelamar</p>
          <p className="text-gray-500 text-sm mt-2">Data akan muncul setelah ada yang submit lamaran</p>
        </div>
      ) : !loading && (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-900/50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Nama</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Kontak</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-400 uppercase">Technical</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-400 uppercase">Psikotes</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-400 uppercase">Overall</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-400 uppercase">CV</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-400 uppercase">Detail</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {filteredApplicants.map((applicant) => (
                  <tr key={applicant.id} className="hover:bg-slate-800/50">
                    <td className="px-4 py-3">
                      <span className="font-mono text-sm text-blue-400">{applicant.id}</span>
                      <p className="text-xs text-gray-500">{applicant.timestamp}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-white font-medium">{applicant.nama}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-gray-300 text-sm">{applicant.email}</p>
                      <a 
                        href={`https://wa.me/${applicant.whatsapp.replace(/^0/, '62')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-400 text-xs hover:underline"
                      >
                        📱 {applicant.whatsapp}
                      </a>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`px-2 py-1 rounded text-sm ${
                        applicant.technicalScore >= 8 ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {applicant.technicalScore}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`px-2 py-1 rounded text-sm ${
                        applicant.psikotesScore >= 8 ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {applicant.psikotesScore}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`px-3 py-1 rounded-full font-bold ${
                        applicant.overallScore >= 8 ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {applicant.overallScore}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      {applicant.cvUrl && applicant.cvUrl.startsWith('http') ? (
                        <a 
                          href={applicant.cvUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-3 py-1 bg-blue-500/20 text-blue-400 rounded hover:bg-blue-500/30 text-sm"
                        >
                          📄 Lihat CV
                        </a>
                      ) : (
                        <span className="text-gray-500 text-sm">{applicant.cvFileName || '-'}</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => setSelectedApplicant(applicant)}
                        className="px-3 py-1 bg-slate-700 text-gray-300 rounded hover:bg-slate-600 text-sm"
                      >
                        👁️ Detail
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {selectedApplicant && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="card p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-bold text-white">{selectedApplicant.nama}</h2>
                <p className="text-gray-400 text-sm">{selectedApplicant.id}</p>
              </div>
              <button
                onClick={() => setSelectedApplicant(null)}
                className="text-gray-400 hover:text-white text-2xl"
              >
                ×
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div className="bg-slate-900/50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-400 mb-2">Kontak</h3>
                <p className="text-white">{selectedApplicant.email}</p>
                <a 
                  href={`https://wa.me/${selectedApplicant.whatsapp.replace(/^0/, '62')}`}
                  target="_blank"
                  className="text-green-400 hover:underline"
                >
                  📱 {selectedApplicant.whatsapp}
                </a>
              </div>
              <div className="bg-slate-900/50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-400 mb-2">CV</h3>
                {selectedApplicant.cvUrl && selectedApplicant.cvUrl.startsWith('http') ? (
                  <a 
                    href={selectedApplicant.cvUrl} 
                    target="_blank"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    📄 Download/Lihat CV
                  </a>
                ) : (
                  <p className="text-gray-500">{selectedApplicant.cvFileName || 'Tidak tersedia'}</p>
                )}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div className="bg-slate-900/50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-400 mb-2">Technical Test: {selectedApplicant.technicalScore}/10</h3>
                {selectedApplicant.technicalDetail && (
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between"><span className="text-gray-400">Problem Solving</span><span className="text-white">{selectedApplicant.technicalDetail.soal1}/10</span></div>
                    <div className="flex justify-between"><span className="text-gray-400">Database</span><span className="text-white">{selectedApplicant.technicalDetail.soal2}/10</span></div>
                    <div className="flex justify-between"><span className="text-gray-400">Git</span><span className="text-white">{selectedApplicant.technicalDetail.soal3}/10</span></div>
                    <div className="flex justify-between"><span className="text-gray-400">Multi-Project</span><span className="text-white">{selectedApplicant.technicalDetail.soal4}/10</span></div>
                    <div className="flex justify-between"><span className="text-gray-400">AI & Automation</span><span className="text-white">{selectedApplicant.technicalDetail.soal5}/10</span></div>
                  </div>
                )}
              </div>
              <div className="bg-slate-900/50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-400 mb-2">Psikotes: {selectedApplicant.psikotesScore}/10</h3>
                {selectedApplicant.psikotesDetail && (
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between"><span className="text-gray-400">Multi-Project</span><span className="text-white">{selectedApplicant.psikotesDetail.multiProject}/10</span></div>
                    <div className="flex justify-between"><span className="text-gray-400">Learning</span><span className="text-white">{selectedApplicant.psikotesDetail.learning}/10</span></div>
                    <div className="flex justify-between"><span className="text-gray-400">Initiative</span><span className="text-white">{selectedApplicant.psikotesDetail.initiative}/10</span></div>
                    <div className="flex justify-between"><span className="text-gray-400">Team</span><span className="text-white">{selectedApplicant.psikotesDetail.team}/10</span></div>
                    <div className="flex justify-between"><span className="text-gray-400">Change</span><span className="text-white">{selectedApplicant.psikotesDetail.change}/10</span></div>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-lg p-4 text-center border border-blue-500/30">
              <p className="text-gray-400 text-sm">Overall Score</p>
              <p className="text-4xl font-bold text-white">{selectedApplicant.overallScore}<span className="text-xl text-gray-400">/10</span></p>
              <p className={`text-sm mt-1 ${selectedApplicant.overallScore >= 8 ? 'text-green-400' : 'text-yellow-400'}`}>
                {selectedApplicant.overallScore >= 8 ? '✅ Recommended untuk interview' : '⚠️ Perlu review lebih lanjut'}
              </p>
            </div>

            <p className="text-gray-500 text-xs text-center mt-4">{selectedApplicant.timestamp}</p>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="mt-8 text-center text-gray-500 text-sm">
        <p>RayCorp Recruitment Admin Dashboard</p>
      </div>
    </div>
  );
}
