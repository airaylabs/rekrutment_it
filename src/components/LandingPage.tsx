'use client';

interface LandingPageProps {
  onStart: () => void;
}

export default function LandingPage({ onStart }: LandingPageProps) {
  return (
    <div className="card p-8 max-w-3xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">
          Selamat Datang di Test Rekrutmen
        </h2>
        <p className="text-gray-400">IT Staff Developer - RayCorp</p>
      </div>

      {/* Info Box */}
      <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-6 mb-6">
        <h3 className="text-lg font-semibold text-blue-400 mb-4 flex items-center gap-2">
          📋 Tentang Test Ini
        </h3>
        <p className="text-gray-300 mb-4">
          Test ini terdiri dari <span className="text-white font-semibold">3 tahap</span> yang harus diselesaikan dalam satu sesi. 
          Pastikan Anda memiliki waktu yang cukup dan tempat yang tenang.
        </p>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-slate-800/50 rounded-lg p-4 text-center">
            <div className="text-2xl mb-2">📝</div>
            <p className="text-white font-medium">Tahap 1</p>
            <p className="text-gray-400 text-sm">Data Diri & CV</p>
            <p className="text-xs text-gray-500 mt-1">~3 menit</p>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-4 text-center">
            <div className="text-2xl mb-2">💻</div>
            <p className="text-white font-medium">Tahap 2</p>
            <p className="text-gray-400 text-sm">Technical Test</p>
            <p className="text-xs text-gray-500 mt-1">~20 menit</p>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-4 text-center">
            <div className="text-2xl mb-2">🧠</div>
            <p className="text-white font-medium">Tahap 3</p>
            <p className="text-gray-400 text-sm">Psikotes</p>
            <p className="text-xs text-gray-500 mt-1">~10 menit</p>
          </div>
        </div>
      </div>

      {/* Rules */}
      <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-6 mb-6">
        <h3 className="text-lg font-semibold text-yellow-400 mb-4 flex items-center gap-2">
          ⚠️ Peraturan Test
        </h3>
        <ul className="space-y-3 text-gray-300 text-sm">
          <li className="flex items-start gap-2">
            <span className="text-yellow-400">•</span>
            <span>Kerjakan sendiri <span className="text-white font-medium">tanpa bantuan orang lain</span></span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-red-400">•</span>
            <span className="text-red-300">
              <span className="font-medium">TIDAK BOLEH</span> menggunakan internet untuk mencari jawaban (Google, ChatGPT, dll)
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-yellow-400">•</span>
            <span>Setelah submit, jawaban <span className="text-white font-medium">tidak dapat diubah</span></span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-yellow-400">•</span>
            <span>Passing score: <span className="text-white font-semibold">8/10</span></span>
          </li>
        </ul>
      </div>

      {/* Timer Warning */}
      <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-6 mb-6">
        <h3 className="text-lg font-semibold text-purple-400 mb-3 flex items-center gap-2">
          ⏱️ Waktu Pengerjaan Dicatat
        </h3>
        <p className="text-gray-300 text-sm mb-3">
          Waktu pengerjaan Anda akan dicatat dan menjadi <span className="text-white font-medium">salah satu bahan evaluasi</span>.
        </p>
        <div className="bg-slate-800/50 rounded-lg p-4">
          <p className="text-gray-400 text-sm mb-2">Target waktu ideal:</p>
          <div className="flex items-center justify-center gap-2">
            <span className="text-3xl font-bold text-purple-400">≤ 35</span>
            <span className="text-gray-400">menit total</span>
          </div>
          <p className="text-xs text-gray-500 text-center mt-2">
            Kandidat yang mengerjakan lebih cepat dengan hasil baik akan mendapat nilai plus
          </p>
        </div>
      </div>

      {/* Preparation Checklist */}
      <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-6 mb-8">
        <h3 className="text-lg font-semibold text-green-400 mb-4 flex items-center gap-2">
          ✅ Sebelum Mulai, Pastikan:
        </h3>
        <ul className="space-y-2 text-gray-300 text-sm">
          <li className="flex items-center gap-2">
            <span className="text-green-400">✓</span>
            <span>CV sudah siap (format PDF, JPG, PNG, atau DOC - max 5MB)</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="text-green-400">✓</span>
            <span>Koneksi internet stabil</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="text-green-400">✓</span>
            <span>Waktu luang sekitar 30-40 menit</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="text-green-400">✓</span>
            <span>Tempat yang tenang untuk fokus</span>
          </li>
        </ul>
      </div>

      {/* Start Button */}
      <div className="text-center">
        <button 
          onClick={onStart}
          className="btn-primary text-lg px-12 py-4"
        >
          🚀 Mulai Test Sekarang
        </button>
        <p className="text-gray-500 text-sm mt-4">
          Dengan memulai test, Anda menyetujui bahwa data yang diberikan adalah benar
        </p>
      </div>
    </div>
  );
}
