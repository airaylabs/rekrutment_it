'use client';

import { useState, useEffect } from 'react';
import { ApplicantData, TechnicalScoreDetails, PsikotesScoreDetails, TimerData } from '@/lib/types';
import { technicalAnswerKeys, psikotesSkenario, psikotesStatements, psikotesC2Options } from '@/lib/questions';

const ADMIN_PASSWORD = 'raycorp2026';

function formatDuration(seconds: number): string {
  if (!seconds) return '-';
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}m ${secs}s`;
}

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [applicants, setApplicants] = useState<ApplicantData[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<'all' | 'pass' | 'fail'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'score'>('date');
  const [selectedApplicant, setSelectedApplicant] = useState<ApplicantData | null>(null);
  const [detailTab, setDetailTab] = useState<'overview' | 'technical' | 'psikotes' | 'cv'>('overview');
  const [cvPreviewUrl, setCvPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      loadApplicants();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (!selectedApplicant && cvPreviewUrl) {
      URL.revokeObjectURL(cvPreviewUrl);
      setCvPreviewUrl(null);
    }
  }, [selectedApplicant, cvPreviewUrl]);

  const loadApplicants = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/applicants');
      const data = await response.json();
      if (data.success && data.data.length > 0) {
        setApplicants(data.data);
      } else {
        const stored = localStorage.getItem('raycorp_applicants');
        if (stored) {
          setApplicants(JSON.parse(stored));
        }
      }
    } catch {
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

  const openDetail = (applicant: ApplicantData) => {
    setSelectedApplicant(applicant);
    setDetailTab('overview');
    if (applicant.cvBase64) {
      setCvPreviewUrl(applicant.cvBase64);
    } else if (applicant.cvUrl && applicant.cvUrl.startsWith('data:')) {
      setCvPreviewUrl(applicant.cvUrl);
    }
  };

  const getOptionLabel = (options: {value: string; label: string}[], value: string) => {
    const opt = options.find(o => o.value === value);
    return opt ? `${value}. ${opt.label}` : value;
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
            <button type="submit" className="btn-primary w-full">Login</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">
            <span className="text-blue-400">RAY</span>CORP Recruitment Dashboard
          </h1>
          <p className="text-gray-400">IT Staff Developer Applications</p>
        </div>
        <div className="flex gap-2">
          <button onClick={loadApplicants} className="btn-secondary text-sm">Refresh</button>
          <button onClick={() => setIsAuthenticated(false)} className="btn-secondary text-sm">Logout</button>
        </div>
      </div>

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
          <p className="text-gray-400 text-sm">Rata-rata</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex gap-2">
          {(['all', 'pass', 'fail'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm ${filter === f ? (f === 'pass' ? 'bg-green-600' : f === 'fail' ? 'bg-yellow-600' : 'bg-blue-600') + ' text-white' : 'bg-slate-700 text-gray-300'}`}
            >
              {f === 'all' ? `Semua (${stats.total})` : f === 'pass' ? `Score ≥ 8 (${stats.pass})` : `Score < 8 (${stats.fail})`}
            </button>
          ))}
        </div>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value as 'date' | 'score')} className="form-select w-auto">
          <option value="date">Urutkan: Terbaru</option>
          <option value="score">Urutkan: Score Tertinggi</option>
        </select>
      </div>

      {loading && <div className="card p-12 text-center"><p className="text-gray-400">Loading...</p></div>}

      {!loading && filteredApplicants.length === 0 ? (
        <div className="card p-12 text-center">
          <p className="text-gray-400 text-lg">Belum ada data pelamar</p>
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
                    <td className="px-4 py-3"><p className="text-white font-medium">{applicant.nama}</p></td>
                    <td className="px-4 py-3">
                      <p className="text-gray-300 text-sm">{applicant.email}</p>
                      <a href={`https://wa.me/${applicant.whatsapp.replace(/^0/, '62')}`} target="_blank" rel="noopener noreferrer" className="text-green-400 text-xs hover:underline">
                        {applicant.whatsapp}
                      </a>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`px-2 py-1 rounded text-sm ${applicant.technicalScore >= 8 ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                        {applicant.technicalScore}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`px-2 py-1 rounded text-sm ${applicant.psikotesScore >= 8 ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                        {applicant.psikotesScore}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`px-3 py-1 rounded-full font-bold ${applicant.overallScore >= 8 ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                        {applicant.overallScore}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      {(applicant.cvBase64 || applicant.cvUrl) ? (
                        <button onClick={() => openDetail(applicant)} className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded hover:bg-blue-500/30 text-sm">
                          Preview
                        </button>
                      ) : (
                        <span className="text-gray-500 text-sm">{applicant.cvFileName || '-'}</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button onClick={() => openDetail(applicant)} className="px-3 py-1 bg-slate-700 text-gray-300 rounded hover:bg-slate-600 text-sm">
                        Detail
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {selectedApplicant && (
        <DetailModal 
          applicant={selectedApplicant}
          cvPreviewUrl={cvPreviewUrl}
          detailTab={detailTab}
          setDetailTab={setDetailTab}
          onClose={() => setSelectedApplicant(null)}
          getOptionLabel={getOptionLabel}
        />
      )}

      <div className="mt-8 text-center text-gray-500 text-sm">
        <p>RayCorp Recruitment Admin Dashboard</p>
      </div>
    </div>
  );
}


function DetailModal({ 
  applicant, 
  cvPreviewUrl, 
  detailTab, 
  setDetailTab, 
  onClose,
  getOptionLabel 
}: {
  applicant: ApplicantData;
  cvPreviewUrl: string | null;
  detailTab: 'overview' | 'technical' | 'psikotes' | 'cv';
  setDetailTab: (tab: 'overview' | 'technical' | 'psikotes' | 'cv') => void;
  onClose: () => void;
  getOptionLabel: (options: {value: string; label: string}[], value: string) => string;
}) {
  const renderCVPreview = () => {
    const cvUrl = cvPreviewUrl || applicant.cvUrl;
    if (!cvUrl) return <p className="text-gray-500 text-center py-8">CV tidak tersedia</p>;

    const mimeType = applicant.cvMimeType || '';
    const isImage = mimeType.startsWith('image/') || cvUrl.startsWith('data:image/');
    const isPDF = mimeType === 'application/pdf' || cvUrl.startsWith('data:application/pdf');

    if (isImage) {
      return (
        <div className="flex flex-col items-center">
          <img src={cvUrl} alt="CV Preview" className="max-w-full max-h-[60vh] rounded-lg shadow-lg" />
          <a href={cvUrl} download={applicant.cvFileName || 'cv'} className="btn-primary mt-4">Download CV</a>
        </div>
      );
    }

    if (isPDF) {
      return (
        <div className="flex flex-col items-center">
          <iframe src={cvUrl} className="w-full h-[60vh] rounded-lg border border-slate-700" title="CV Preview" />
          <a href={cvUrl} download={applicant.cvFileName || 'cv.pdf'} className="btn-primary mt-4">Download PDF</a>
        </div>
      );
    }

    return (
      <div className="text-center py-8">
        <p className="text-gray-400 mb-4">Preview tidak tersedia untuk file ini</p>
        <a href={cvUrl} download={applicant.cvFileName || 'cv'} className="btn-primary">Download File</a>
      </div>
    );
  };

  const renderTechnicalDetail = () => {
    const answers = applicant.technicalAnswers;
    const details = applicant.technicalScoreDetails;
    
    if (!answers || !details) return <p className="text-gray-500">Detail jawaban tidak tersedia</p>;

    const categories = [
      { id: 'php_laravel', title: 'PHP/Laravel (35%)', questions: ['soal1a', 'soal1b', 'soal1c', 'soal1d', 'soal1e'] },
      { id: 'mysql', title: 'MySQL (bagian dari 25%)', questions: ['soal2a', 'soal2b', 'soal2c', 'soal2d'] },
      { id: 'git', title: 'Git (bagian dari 25%)', questions: ['soal3a', 'soal3b', 'soal3c', 'soal3d'] },
      { id: 'problem_solving', title: 'Problem Solving (25%)', questions: ['soal4a', 'soal4b', 'soal4c', 'soal4d'] },
      { id: 'ai_automation', title: 'AI & Automation (15%)', questions: ['soal5a', 'soal5b', 'soal5c'] },
    ];

    return (
      <div className="space-y-6">
        {categories.map((cat) => {
          const correctCount = cat.questions.filter(q => details[q]?.correct).length;
          const totalCount = cat.questions.length;
          const score = Math.round((correctCount / totalCount) * 10 * 10) / 10;
          
          return (
            <div key={cat.id} className="bg-slate-900/50 rounded-lg p-4">
              <div className="flex justify-between items-center mb-3">
                <h4 className="text-blue-400 font-semibold">{cat.title}</h4>
                <span className={`px-2 py-1 rounded text-sm ${score >= 7 ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                  {correctCount}/{totalCount} benar ({score}/10)
                </span>
              </div>
              
              {cat.questions.map((qId) => {
                const detail = details[qId];
                if (!detail) return null;
                
                return (
                  <div key={qId} className="mb-3 pl-4 border-l-2 border-slate-700">
                    <div className="flex items-start gap-2">
                      <span className={`text-lg ${detail.correct ? 'text-green-400' : 'text-red-400'}`}>
                        {detail.correct ? '✓' : '✗'}
                      </span>
                      <div className="flex-1">
                        <p className="text-white text-sm">
                          <span className="text-gray-400">{qId}:</span> Jawaban: {detail.answer || '-'}
                        </p>
                        {!detail.correct && (
                          <p className="text-yellow-400 text-xs mt-1">
                            Jawaban benar: {detail.correctAnswer}
                            {technicalAnswerKeys[qId] && (
                              <span className="text-gray-500 ml-2">
                                ({technicalAnswerKeys[qId].explanation})
                              </span>
                            )}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    );
  };

  const renderPsikotesDetail = () => {
    const answers = applicant.psikotesAnswers;
    if (!answers) return <p className="text-gray-500">Detail jawaban tidak tersedia</p>;

    return (
      <div className="space-y-6">
        <div className="bg-slate-900/50 rounded-lg p-4">
          <h4 className="text-blue-400 font-semibold mb-3">Bagian A: Situational Judgment</h4>
          {psikotesSkenario.map((skenario) => {
            const answer = answers[skenario.id as keyof typeof answers] as string;
            const isIdeal = answer === skenario.idealAnswer;
            return (
              <div key={skenario.id} className="mb-4 pl-4 border-l-2 border-slate-700">
                <p className="text-gray-300 text-sm mb-2">{skenario.title}</p>
                <div className="flex items-start gap-2">
                  <span className={`text-lg ${isIdeal ? 'text-green-400' : 'text-yellow-400'}`}>
                    {isIdeal ? '✓' : '○'}
                  </span>
                  <div>
                    <p className="text-white text-sm">{getOptionLabel(skenario.options, answer)}</p>
                    {!isIdeal && (
                      <p className="text-green-400 text-xs mt-1">
                        Jawaban ideal: {getOptionLabel(skenario.options, skenario.idealAnswer)}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-slate-900/50 rounded-lg p-4">
          <h4 className="text-blue-400 font-semibold mb-3">Bagian B: Self-Assessment</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {psikotesStatements.map((stmt) => {
              const value = answers[stmt.id as keyof typeof answers] as number;
              return (
                <div key={stmt.id} className="flex items-center justify-between bg-slate-800/50 p-2 rounded">
                  <p className="text-gray-300 text-sm flex-1">{stmt.text}</p>
                  <span className={`ml-2 px-2 py-1 rounded text-sm font-bold ${
                    value >= 4 ? 'bg-green-500/20 text-green-400' : 
                    value >= 3 ? 'bg-yellow-500/20 text-yellow-400' : 
                    'bg-red-500/20 text-red-400'
                  }`}>
                    {value}/5
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-slate-900/50 rounded-lg p-4">
          <h4 className="text-blue-400 font-semibold mb-3">Bagian C & D: Refleksi</h4>
          <div className="mb-4">
            <p className="text-gray-400 text-sm mb-2">Problem Solving Preference:</p>
            <p className="text-white bg-slate-800 p-2 rounded text-sm">{getOptionLabel(psikotesC2Options, answers.c2)}</p>
          </div>
          <div className="mb-4">
            <p className="text-gray-400 text-sm mb-2">Pengalaman belajar sesuatu baru:</p>
            <p className="text-white bg-slate-800 p-3 rounded text-sm">{answers.d1 || '-'}</p>
          </div>
          <div>
            <p className="text-gray-400 text-sm mb-2">Alasan melamar di RayCorp:</p>
            <p className="text-white bg-slate-800 p-3 rounded text-sm">{answers.d2 || '-'}</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="card p-6 max-w-4xl w-full max-h-[95vh] overflow-y-auto my-4">
        <div className="flex justify-between items-start mb-4 sticky top-0 bg-slate-800 py-2 -mt-2 z-10">
          <div>
            <h2 className="text-xl font-bold text-white">{applicant.nama}</h2>
            <p className="text-gray-400 text-sm">{applicant.id} • {applicant.timestamp}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl p-2">×</button>
        </div>

        <div className="flex gap-2 mb-6 border-b border-slate-700 pb-2">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'technical', label: 'Technical' },
            { id: 'psikotes', label: 'Psikotes' },
            { id: 'cv', label: 'CV' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setDetailTab(tab.id as typeof detailTab)}
              className={`px-4 py-2 rounded-lg text-sm transition-all ${
                detailTab === tab.id ? 'bg-blue-600 text-white' : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {detailTab === 'overview' && (
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-slate-900/50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-400 mb-2">Kontak</h3>
                <p className="text-white">{applicant.email}</p>
                <a href={`https://wa.me/${applicant.whatsapp.replace(/^0/, '62')}`} target="_blank" className="text-green-400 hover:underline">
                  {applicant.whatsapp}
                </a>
              </div>
              <div className="bg-slate-900/50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-400 mb-2">CV</h3>
                <p className="text-white">{applicant.cvFileName || 'Tidak tersedia'}</p>
                <button onClick={() => setDetailTab('cv')} className="text-blue-400 hover:underline text-sm">Lihat Preview</button>
              </div>
            </div>

            {/* Timer Info */}
            {applicant.timer && (
              <div className="bg-slate-900/50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-400 mb-3">⏱️ Waktu Pengerjaan</h3>
                <div className="grid grid-cols-4 gap-2 text-center text-sm">
                  <div className="bg-slate-800 rounded p-2">
                    <p className="text-gray-400 text-xs">Data Diri</p>
                    <p className="text-white font-medium">{formatDuration(applicant.timer.personalDuration)}</p>
                  </div>
                  <div className="bg-slate-800 rounded p-2">
                    <p className="text-gray-400 text-xs">Technical</p>
                    <p className="text-white font-medium">{formatDuration(applicant.timer.technicalDuration)}</p>
                  </div>
                  <div className="bg-slate-800 rounded p-2">
                    <p className="text-gray-400 text-xs">Psikotes</p>
                    <p className="text-white font-medium">{formatDuration(applicant.timer.psikotesDuration)}</p>
                  </div>
                  <div className="bg-blue-500/20 rounded p-2">
                    <p className="text-blue-400 text-xs">Total</p>
                    <p className="text-white font-bold">{formatDuration(applicant.timer.totalDuration)}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-slate-900/50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-400 mb-2">Technical: {applicant.technicalScore}/10</h3>
                {applicant.technicalDetail && (
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between"><span className="text-gray-400">PHP/Laravel (35%)</span><span className="text-white">{applicant.technicalDetail.phpLaravel}/10</span></div>
                    <div className="flex justify-between"><span className="text-gray-400">MySQL & Git (25%)</span><span className="text-white">{applicant.technicalDetail.mysqlGit}/10</span></div>
                    <div className="flex justify-between"><span className="text-gray-400">Problem Solving (25%)</span><span className="text-white">{applicant.technicalDetail.problemSolving}/10</span></div>
                    <div className="flex justify-between"><span className="text-gray-400">AI/Automation (15%)</span><span className="text-white">{applicant.technicalDetail.aiAutomation}/10</span></div>
                  </div>
                )}
                <button onClick={() => setDetailTab('technical')} className="text-blue-400 hover:underline text-sm mt-2">Lihat Detail Jawaban</button>
              </div>
              <div className="bg-slate-900/50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-400 mb-2">Psikotes: {applicant.psikotesScore}/10</h3>
                {applicant.psikotesDetail && (
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between"><span className="text-gray-400">Multi-Project</span><span className="text-white">{applicant.psikotesDetail.multiProject}/10</span></div>
                    <div className="flex justify-between"><span className="text-gray-400">Learning</span><span className="text-white">{applicant.psikotesDetail.learning}/10</span></div>
                    <div className="flex justify-between"><span className="text-gray-400">Initiative</span><span className="text-white">{applicant.psikotesDetail.initiative}/10</span></div>
                    <div className="flex justify-between"><span className="text-gray-400">Team</span><span className="text-white">{applicant.psikotesDetail.team}/10</span></div>
                    <div className="flex justify-between"><span className="text-gray-400">Change</span><span className="text-white">{applicant.psikotesDetail.change}/10</span></div>
                  </div>
                )}
                <button onClick={() => setDetailTab('psikotes')} className="text-blue-400 hover:underline text-sm mt-2">Lihat Detail Jawaban</button>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-lg p-4 text-center border border-blue-500/30">
              <p className="text-gray-400 text-sm">Overall Score (Technical 70% + Psikotes 30%)</p>
              <p className="text-4xl font-bold text-white">{applicant.overallScore}<span className="text-xl text-gray-400">/10</span></p>
              <p className={`text-sm mt-1 ${applicant.overallScore >= 8 ? 'text-green-400' : 'text-yellow-400'}`}>
                {applicant.overallScore >= 8 ? 'Recommended untuk interview' : 'Perlu review lebih lanjut'}
              </p>
            </div>
          </div>
        )}

        {detailTab === 'technical' && renderTechnicalDetail()}
        {detailTab === 'psikotes' && renderPsikotesDetail()}
        {detailTab === 'cv' && renderCVPreview()}
      </div>
    </div>
  );
}
