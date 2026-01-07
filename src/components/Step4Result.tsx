'use client';

import { FinalResult } from '@/lib/types';

interface Step4Props {
  result: FinalResult;
}

export default function Step4Result({ result }: Step4Props) {
  return (
    <div className="card p-8 max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <div className="text-6xl mb-4">✅</div>
        <h2 className="text-3xl font-bold text-white mb-2">Terima Kasih!</h2>
        <p className="text-gray-400">Data lamaran Anda telah berhasil dikirim</p>
      </div>

      {/* ID Lamaran */}
      <div className="bg-slate-900/50 rounded-lg p-6 mb-6 text-center">
        <p className="text-gray-400 text-sm mb-1">ID Lamaran Anda</p>
        <p className="text-2xl font-mono font-bold text-blue-400 mb-2">{result.id}</p>
        <p className="text-sm text-gray-500">Simpan ID ini untuk referensi</p>
      </div>

      {/* Score Preview (tanpa status lulus/tidak) */}
      <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-lg p-6 mb-6 text-center border border-blue-500/30">
        <p className="text-gray-400 text-sm mb-1">Skor Anda</p>
        <p className="text-5xl font-bold text-white">{result.overallScore}<span className="text-2xl text-gray-400">/10</span></p>
      </div>

      {/* Detail Scores */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {/* Technical */}
        <div className="bg-slate-900/50 rounded-lg p-5">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            💻 Technical Test
            <span className="text-sm px-2 py-1 rounded bg-blue-500/20 text-blue-400">
              {result.technical.total}/10
            </span>
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Problem Solving</span>
              <span className="text-white">{result.technical.soal1}/10</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Database</span>
              <span className="text-white">{result.technical.soal2}/10</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Git</span>
              <span className="text-white">{result.technical.soal3}/10</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Multi-Project</span>
              <span className="text-white">{result.technical.soal4}/10</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">AI & Automation</span>
              <span className="text-white">{result.technical.soal5}/10</span>
            </div>
          </div>
        </div>

        {/* Psikotes */}
        <div className="bg-slate-900/50 rounded-lg p-5">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            🧠 Psikotes
            <span className="text-sm px-2 py-1 rounded bg-purple-500/20 text-purple-400">
              {result.psikotes.total}/10
            </span>
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Multi-Project Adaptability</span>
              <span className="text-white">{result.psikotes.multiProject}/10</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Learning Agility</span>
              <span className="text-white">{result.psikotes.learning}/10</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Initiative</span>
              <span className="text-white">{result.psikotes.initiative}/10</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Team Collaboration</span>
              <span className="text-white">{result.psikotes.team}/10</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Change Tolerance</span>
              <span className="text-white">{result.psikotes.change}/10</span>
            </div>
          </div>
        </div>
      </div>

      {/* Next Steps - Netral */}
      <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
          📋 Langkah Selanjutnya
        </h3>
        <div className="text-gray-300 space-y-3">
          <p>
            Data lamaran dan hasil test Anda telah kami terima. Tim HR akan meninjau dan mengevaluasi 
            kecocokan Anda dengan kebutuhan tim IT RayCorp.
          </p>
          <div className="bg-slate-800/50 rounded-lg p-4">
            <p className="text-sm text-gray-400 mb-2">Kami akan menghubungi Anda melalui:</p>
            <ul className="space-y-1 text-sm">
              <li className="flex items-center gap-2">
                <span className="text-green-400">📱</span>
                <span>WhatsApp: <span className="text-white">{result.personal.whatsapp}</span></span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-blue-400">📧</span>
                <span>Email: <span className="text-white">{result.personal.email}</span></span>
              </li>
            </ul>
          </div>
          <p className="text-sm text-yellow-400/80 flex items-center gap-2">
            ⚠️ Pastikan WhatsApp dan Email Anda aktif untuk menerima informasi selanjutnya.
          </p>
        </div>
      </div>

      {/* Info Box */}
      <div className="mt-6 bg-slate-900/50 rounded-lg p-4 text-center">
        <p className="text-gray-400 text-sm">
          Proses review biasanya memakan waktu <span className="text-white">1-3 hari kerja</span>. 
          Jika Anda lolos tahap ini, kami akan mengundang Anda untuk interview.
        </p>
      </div>

      {/* Footer */}
      <div className="mt-8 text-center text-gray-500 text-sm">
        <p>RayCorp Recruitment System</p>
        <p className="text-xs mt-1">{result.timestamp}</p>
      </div>
    </div>
  );
}
