// ============================================
// TECHNICAL TEST - 100% PILIHAN GANDA
// Scoring akurat tanpa AI, tanpa interpretasi
// ============================================

// SOAL 1: PHP & Laravel (BOBOT TERTINGGI - 35%)
export const technicalQuestions = [
  {
    id: 'soal1',
    title: 'SOAL 1: PHP & Laravel Framework',
    category: 'php_laravel',
    weight: 0.35, // 35% dari technical score
    description: `Perhatikan code Laravel berikut yang digunakan untuk menampilkan daftar produk:

\`\`\`php
public function getProducts($categoryId)
{
    $products = Product::where('category_id', $categoryId)->get();
    
    $result = [];
    foreach ($products as $product) {
        $result[] = [
            'name' => $product->name,
            'price' => $product->price,
            'discount_price' => $product->price - ($product->price * $product->discount / 100),
            'stock_status' => $product->stock > 0 ? 'Available' : 'Out of Stock'
        ];
    }
    
    return response()->json([
        'total' => count($products),
        'average_price' => array_sum(array_column($result, 'price')) / count($result),
        'products' => $result
    ]);
}
\`\`\`

**Error:** \`Division by zero\` ketika category tidak punya produk.`,
    questions: [
      { 
        id: 'soal1a', 
        type: 'multiple',
        label: '1.1) Di baris mana error "Division by zero" terjadi?',
        options: [
          { value: 'A', label: 'Baris $products = Product::where(...)->get()' },
          { value: 'B', label: 'Baris foreach ($products as $product)' },
          { value: 'C', label: "Baris 'average_price' => array_sum(...) / count($result)" },
          { value: 'D', label: "Baris 'total' => count($products)" }
        ],
        correctAnswer: 'C'
      },
      { 
        id: 'soal1b', 
        type: 'multiple',
        label: '1.2) Apa penyebab utama error tersebut?',
        options: [
          { value: 'A', label: 'Query database gagal mengembalikan data' },
          { value: 'B', label: 'Variable $result kosong saat category tidak punya produk' },
          { value: 'C', label: 'Syntax PHP pada array_column salah' },
          { value: 'D', label: 'Method get() mengembalikan null' }
        ],
        correctAnswer: 'B'
      },
      { 
        id: 'soal1c', 
        type: 'multiple',
        label: '1.3) Cara terbaik untuk fix error ini di Laravel adalah?',
        options: [
          { value: 'A', label: 'Gunakan try-catch untuk handle exception' },
          { value: 'B', label: 'Cek if (count($result) > 0) sebelum kalkulasi average' },
          { value: 'C', label: 'Ganti get() dengan first()' },
          { value: 'D', label: 'Tambahkan default value di database' }
        ],
        correctAnswer: 'B'
      },
      { 
        id: 'soal1d', 
        type: 'multiple',
        label: '1.4) Di Laravel, method Eloquent mana yang digunakan untuk mengambil satu record berdasarkan ID?',
        options: [
          { value: 'A', label: 'Product::get($id)' },
          { value: 'B', label: 'Product::find($id)' },
          { value: 'C', label: 'Product::where($id)' },
          { value: 'D', label: 'Product::fetch($id)' }
        ],
        correctAnswer: 'B'
      },
      { 
        id: 'soal1e', 
        type: 'multiple',
        label: '1.5) Untuk relasi "satu kategori punya banyak produk" di Laravel, method apa yang digunakan di Model Category?',
        options: [
          { value: 'A', label: 'belongsTo()' },
          { value: 'B', label: 'hasOne()' },
          { value: 'C', label: 'hasMany()' },
          { value: 'D', label: 'belongsToMany()' }
        ],
        correctAnswer: 'C'
      }
    ]
  },
  {
    id: 'soal2',
    title: 'SOAL 2: MySQL Database',
    category: 'mysql_git',
    weight: 0.25, // 25% dari technical score (gabung dengan Git)
    description: `RayCorp punya tabel \`orders\` dengan jutaan data. Tim butuh laporan "Total penjualan per bulan di tahun 2025".

\`\`\`sql
CREATE TABLE orders (
    id INT PRIMARY KEY AUTO_INCREMENT,
    customer_id INT NOT NULL,
    total_amount DECIMAL(12,2) NOT NULL,
    status ENUM('pending', 'paid', 'shipped', 'completed', 'cancelled'),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_customer (customer_id),
    INDEX idx_status_date (status, created_at)
);
\`\`\``,
    questions: [
      { 
        id: 'soal2a', 
        type: 'multiple',
        label: '2.1) Clause SQL mana yang digunakan untuk mengelompokkan data per bulan?',
        options: [
          { value: 'A', label: 'ORDER BY MONTH(created_at)' },
          { value: 'B', label: 'GROUP BY MONTH(created_at)' },
          { value: 'C', label: 'PARTITION BY MONTH(created_at)' },
          { value: 'D', label: 'HAVING MONTH(created_at)' }
        ],
        correctAnswer: 'B'
      },
      { 
        id: 'soal2b', 
        type: 'multiple',
        label: '2.2) Query mana yang BENAR untuk total penjualan per bulan (status completed, tahun 2025)?',
        options: [
          { value: 'A', label: "SELECT MONTH(created_at), SUM(total_amount) FROM orders WHERE status = 'completed' AND YEAR(created_at) = 2025 GROUP BY MONTH(created_at)" },
          { value: 'B', label: "SELECT MONTH(created_at), COUNT(total_amount) FROM orders WHERE status = 'completed' GROUP BY created_at" },
          { value: 'C', label: "SELECT created_at, SUM(total_amount) FROM orders WHERE status = 'completed' ORDER BY MONTH(created_at)" },
          { value: 'D', label: "SELECT MONTH(created_at), AVG(total_amount) FROM orders HAVING status = 'completed'" }
        ],
        correctAnswer: 'A'
      },
      { 
        id: 'soal2c', 
        type: 'multiple',
        label: '2.3) Index mana yang paling optimal untuk query laporan di atas?',
        options: [
          { value: 'A', label: 'INDEX(customer_id)' },
          { value: 'B', label: 'INDEX(total_amount)' },
          { value: 'C', label: 'INDEX(status, created_at)' },
          { value: 'D', label: 'INDEX(id, customer_id)' }
        ],
        correctAnswer: 'C'
      },
      { 
        id: 'soal2d', 
        type: 'multiple',
        label: '2.4) Apa perbedaan utama antara WHERE dan HAVING di SQL?',
        options: [
          { value: 'A', label: 'WHERE untuk filter sebelum GROUP BY, HAVING untuk filter setelah GROUP BY' },
          { value: 'B', label: 'WHERE hanya untuk angka, HAVING untuk text' },
          { value: 'C', label: 'WHERE lebih cepat dari HAVING' },
          { value: 'D', label: 'Tidak ada perbedaan, keduanya sama' }
        ],
        correctAnswer: 'A'
      }
    ]
  }
];

export const technicalQuestions2 = [
  {
    id: 'soal3',
    title: 'SOAL 3: Git Version Control',
    category: 'mysql_git',
    weight: 0, // Sudah digabung dengan soal2 (total 25%)
    description: `Anda sedang mengerjakan fitur baru di branch \`feature/payment\`. Tiba-tiba ada bug urgent di production yang harus segera diperbaiki.`,
    questions: [
      { 
        id: 'soal3a', 
        type: 'multiple',
        label: '3.1) Command Git mana untuk menyimpan sementara pekerjaan yang belum selesai?',
        options: [
          { value: 'A', label: 'git save' },
          { value: 'B', label: 'git stash' },
          { value: 'C', label: 'git store' },
          { value: 'D', label: 'git backup' }
        ],
        correctAnswer: 'B'
      },
      { 
        id: 'soal3b', 
        type: 'multiple',
        label: '3.2) Setelah fix bug, command apa untuk mengambil kembali pekerjaan yang di-stash?',
        options: [
          { value: 'A', label: 'git stash get' },
          { value: 'B', label: 'git stash restore' },
          { value: 'C', label: 'git stash pop' },
          { value: 'D', label: 'git stash load' }
        ],
        correctAnswer: 'C'
      },
      { 
        id: 'soal3c', 
        type: 'multiple',
        label: '3.3) Apa perbedaan utama git merge dan git rebase?',
        options: [
          { value: 'A', label: 'Merge menghapus commit, rebase menyimpan commit' },
          { value: 'B', label: 'Merge membuat merge commit baru, rebase menulis ulang history' },
          { value: 'C', label: 'Merge untuk branch lokal, rebase untuk remote' },
          { value: 'D', label: 'Tidak ada perbedaan, keduanya sama' }
        ],
        correctAnswer: 'B'
      },
      { 
        id: 'soal3d', 
        type: 'multiple',
        label: '3.4) Command untuk melihat history commit dalam satu baris per commit?',
        options: [
          { value: 'A', label: 'git log --short' },
          { value: 'B', label: 'git log --oneline' },
          { value: 'C', label: 'git history --line' },
          { value: 'D', label: 'git show --brief' }
        ],
        correctAnswer: 'B'
      }
    ]
  },
  {
    id: 'soal4',
    title: 'SOAL 4: Problem Solving & Analytical',
    category: 'problem_solving',
    weight: 0.25, // 25% dari technical score
    description: `Anda handle 3 project sekaligus di RayCorp:

| Project | Deadline | Progress | Issue |
|---------|----------|----------|-------|
| Website Lunaray.id | Besok | 80% | Minor bug di checkout |
| ERP System | Minggu depan | 40% | Butuh integrasi API baru |
| Portal Artikel | 2 minggu lagi | 20% | Tidak ada issue |

Hari ini Anda juga diminta bantu onboarding developer baru (estimasi 2 jam).`,
    questions: [
      { 
        id: 'soal4a', 
        type: 'multiple',
        label: '4.1) Project mana yang harus diprioritaskan PERTAMA?',
        options: [
          { value: 'A', label: 'ERP System - karena progress paling rendah di 40%' },
          { value: 'B', label: 'Website Lunaray.id - karena deadline besok' },
          { value: 'C', label: 'Portal Artikel - karena tidak ada issue' },
          { value: 'D', label: 'Onboarding developer baru - karena diminta hari ini' }
        ],
        correctAnswer: 'B'
      },
      { 
        id: 'soal4b', 
        type: 'multiple',
        label: '4.2) Jika bug Website Lunaray.id ternyata lebih kompleks dan butuh 2 hari, apa yang sebaiknya dilakukan?',
        options: [
          { value: 'A', label: 'Tetap kerjakan sendiri sampai selesai walau lembur' },
          { value: 'B', label: 'Abaikan bug, fokus project lain yang lebih mudah' },
          { value: 'C', label: 'Komunikasikan ke stakeholder dan negosiasi deadline' },
          { value: 'D', label: 'Kerjakan setengah-setengah semua project' }
        ],
        correctAnswer: 'C'
      },
      { 
        id: 'soal4c', 
        type: 'multiple',
        label: '4.3) Dalam debugging, pendekatan mana yang paling efektif?',
        options: [
          { value: 'A', label: 'Langsung ubah code yang mencurigakan' },
          { value: 'B', label: 'Reproduce error → Isolasi masalah → Fix → Test' },
          { value: 'C', label: 'Tanya rekan kerja tanpa mencoba sendiri dulu' },
          { value: 'D', label: 'Restart server dan berharap error hilang' }
        ],
        correctAnswer: 'B'
      },
      { 
        id: 'soal4d', 
        type: 'multiple',
        label: '4.4) API endpoint mengembalikan error 500. Langkah pertama yang harus dilakukan?',
        options: [
          { value: 'A', label: 'Langsung deploy ulang aplikasi' },
          { value: 'B', label: 'Cek log server untuk melihat detail error' },
          { value: 'C', label: 'Hubungi tim infrastructure' },
          { value: 'D', label: 'Restart database server' }
        ],
        correctAnswer: 'B'
      }
    ]
  },
  {
    id: 'soal5',
    title: 'SOAL 5: AI & Automation (Nilai Plus)',
    category: 'ai_automation',
    weight: 0.15, // 15% dari technical score
    description: `RayCorp menggunakan n8n untuk otomasi workflow dan AI tools untuk meningkatkan produktivitas.

**Contoh workflow n8n:**
\`\`\`
Order Masuk (Webhook) → Kirim WA ke Admin → Simpan ke Google Sheets
\`\`\``,
    questions: [
      { 
        id: 'soal5a', 
        type: 'multiple',
        label: '5.1) Di n8n, node apa yang digunakan untuk menerima data dari external system?',
        options: [
          { value: 'A', label: 'HTTP Request node' },
          { value: 'B', label: 'Webhook node' },
          { value: 'C', label: 'Trigger node' },
          { value: 'D', label: 'Start node' }
        ],
        correctAnswer: 'B'
      },
      { 
        id: 'soal5b', 
        type: 'multiple',
        label: '5.2) Bagaimana cara handle error di n8n workflow?',
        options: [
          { value: 'A', label: 'Biarkan saja, workflow akan retry otomatis' },
          { value: 'B', label: 'Gunakan Error Trigger node untuk catch error' },
          { value: 'C', label: 'Hapus node yang bermasalah' },
          { value: 'D', label: 'Tidak bisa di-handle di n8n' }
        ],
        correctAnswer: 'B'
      },
      { 
        id: 'soal5c', 
        type: 'multiple',
        label: '5.3) Apa yang dimaksud dengan "prompt engineering" dalam konteks AI?',
        options: [
          { value: 'A', label: 'Membuat hardware untuk AI' },
          { value: 'B', label: 'Teknik menulis instruksi yang efektif untuk AI' },
          { value: 'C', label: 'Programming bahasa khusus AI' },
          { value: 'D', label: 'Mendesain tampilan AI chatbot' }
        ],
        correctAnswer: 'B'
      }
    ]
  }
];

// ============================================
// PSIKOTES - PILIHAN GANDA + RATING
// ============================================

export const psikotesSkenario = [
  {
    id: 'skenario1',
    title: 'Skenario 1: Multi-Project Pressure',
    description: 'Anda handle 2 project dengan deadline besok dan lusa. Rekan baru minta bantuan karena stuck 3 jam dengan error.',
    options: [
      { value: 'A', label: 'Fokus project sendiri, minta rekan cari solusi sendiri' },
      { value: 'B', label: 'Langsung bantu sampai selesai, deadline bisa dinego' },
      { value: 'C', label: 'Luangkan 15-20 menit kasih petunjuk, lalu kembali ke project' },
      { value: 'D', label: 'Minta rekan catat masalahnya, bantu setelah project selesai' },
      { value: 'E', label: 'Eskalasi ke lead bahwa ada konflik prioritas' }
    ],
    idealAnswer: 'C',
    scoring: { 'A': 2, 'B': 3, 'C': 5, 'D': 3, 'E': 4 }
  },
  {
    id: 'skenario2',
    title: 'Skenario 2: Perubahan Mendadak',
    description: 'Project 2 minggu di-cancel, harus pindah ke project baru dengan teknologi yang belum pernah dipakai.',
    options: [
      { value: 'A', label: 'Kecewa dan butuh waktu untuk adaptasi' },
      { value: 'B', label: 'Excited dengan tantangan baru, langsung belajar' },
      { value: 'C', label: 'Netral, ini bagian dari pekerjaan' },
      { value: 'D', label: 'Frustrasi karena effort terbuang, tapi tetap profesional' },
      { value: 'E', label: 'Tanya management alasan perubahan untuk memahami konteks' }
    ],
    idealAnswer: 'B',
    scoring: { 'A': 3, 'B': 5, 'C': 4, 'D': 2, 'E': 4 }
  },
  {
    id: 'skenario3',
    title: 'Skenario 3: Ide Improvement',
    description: 'Punya ide improvement workflow yang bisa hemat 30% waktu, tapi cara kerja sudah ditetapkan.',
    options: [
      { value: 'A', label: 'Simpan ide untuk diri sendiri' },
      { value: 'B', label: 'Implementasi di pekerjaan sendiri tanpa ubah workflow tim' },
      { value: 'C', label: 'Sampaikan ke lead/manager dengan data dan alasan jelas' },
      { value: 'D', label: 'Diskusikan dulu dengan rekan setim untuk dapat feedback' },
      { value: 'E', label: 'Tunggu momen yang tepat seperti retrospective' }
    ],
    idealAnswer: 'C',
    scoring: { 'A': 1, 'B': 3, 'C': 5, 'D': 4, 'E': 4 }
  }
];

export const psikotesStatements = [
  { id: 'b1', text: 'Saya nyaman mengerjakan beberapa project secara bersamaan', category: 'multiProject' },
  { id: 'b2', text: 'Saya excited ketika harus belajar teknologi atau tools baru', category: 'learning' },
  { id: 'b3', text: 'Saya senang berbagi knowledge dan membantu rekan yang kesulitan', category: 'team' },
  { id: 'b4', text: 'Perubahan rencana mendadak tidak terlalu mengganggu saya', category: 'change' },
  { id: 'b5', text: 'Saya proaktif mencari solusi, bukan menunggu instruksi', category: 'initiative' },
  { id: 'b6', text: 'Saya bisa bekerja efektif meskipun requirement belum 100% jelas', category: 'change' },
  { id: 'b7', text: 'Saya nyaman menerima kritik dan feedback dari orang lain', category: 'team' },
  { id: 'b8', text: 'Saya berani mencoba pendekatan baru meskipun ada risiko gagal', category: 'initiative' },
  { id: 'b9', text: 'Saya bisa tetap fokus dan produktif meskipun ada tekanan deadline', category: 'multiProject' },
  { id: 'b10', text: 'Saya rutin mengikuti perkembangan teknologi di luar jam kerja', category: 'learning' }
];

export const psikotesC2Options = [
  { value: 'A', label: 'Coba selesaikan sendiri dulu sampai mentok' },
  { value: 'B', label: 'Langsung diskusi dengan tim untuk brainstorming' },
  { value: 'C', label: 'Riset di internet/dokumentasi' },
  { value: 'D', label: 'Tanya ke senior atau yang lebih berpengalaman' },
  { value: 'E', label: 'Kombinasi - riset dulu, kalau stuck baru tanya tim' }
];

// ============================================
// ANSWER KEYS - UNTUK SCORING 100% AKURAT
// ============================================

export const technicalAnswerKeys: Record<string, { correct: string; explanation: string }> = {
  // Soal 1: PHP/Laravel (35%)
  soal1a: { correct: 'C', explanation: 'Error terjadi di baris average_price karena count($result) = 0' },
  soal1b: { correct: 'B', explanation: 'Ketika category tidak punya produk, $result kosong' },
  soal1c: { correct: 'B', explanation: 'Cek count > 0 sebelum division adalah best practice' },
  soal1d: { correct: 'B', explanation: 'find() adalah method Eloquent untuk mengambil by ID' },
  soal1e: { correct: 'C', explanation: 'hasMany() untuk relasi one-to-many' },
  
  // Soal 2: MySQL (bagian dari 25%)
  soal2a: { correct: 'B', explanation: 'GROUP BY untuk mengelompokkan data' },
  soal2b: { correct: 'A', explanation: 'Query lengkap dengan SUM, WHERE, dan GROUP BY' },
  soal2c: { correct: 'C', explanation: 'Index (status, created_at) optimal untuk filter dan group' },
  soal2d: { correct: 'A', explanation: 'WHERE filter sebelum GROUP, HAVING filter setelah GROUP' },
  
  // Soal 3: Git (bagian dari 25%)
  soal3a: { correct: 'B', explanation: 'git stash menyimpan perubahan sementara' },
  soal3b: { correct: 'C', explanation: 'git stash pop mengambil dan menghapus stash' },
  soal3c: { correct: 'B', explanation: 'Merge buat commit baru, rebase tulis ulang history' },
  soal3d: { correct: 'B', explanation: 'git log --oneline menampilkan satu baris per commit' },
  
  // Soal 4: Problem Solving (25%)
  soal4a: { correct: 'B', explanation: 'Deadline terdekat harus diprioritaskan' },
  soal4b: { correct: 'C', explanation: 'Komunikasi dengan stakeholder adalah kunci' },
  soal4c: { correct: 'B', explanation: 'Systematic debugging: reproduce → isolate → fix → test' },
  soal4d: { correct: 'B', explanation: 'Cek log adalah langkah pertama debugging' },
  
  // Soal 5: AI/Automation (15%)
  soal5a: { correct: 'B', explanation: 'Webhook node menerima data dari external' },
  soal5b: { correct: 'B', explanation: 'Error Trigger node untuk handle error' },
  soal5c: { correct: 'B', explanation: 'Prompt engineering adalah teknik menulis instruksi AI' }
};

// Bobot per kategori untuk scoring
export const categoryWeights = {
  php_laravel: 0.35,      // 35% - PHP/Laravel (5 soal)
  mysql_git: 0.25,        // 25% - MySQL + Git (8 soal)
  problem_solving: 0.25,  // 25% - Problem Solving (4 soal)
  ai_automation: 0.15     // 15% - AI/Automation (3 soal)
};

// Mapping soal ke kategori
export const questionCategories: Record<string, string> = {
  soal1a: 'php_laravel',
  soal1b: 'php_laravel',
  soal1c: 'php_laravel',
  soal1d: 'php_laravel',
  soal1e: 'php_laravel',
  soal2a: 'mysql_git',
  soal2b: 'mysql_git',
  soal2c: 'mysql_git',
  soal2d: 'mysql_git',
  soal3a: 'mysql_git',
  soal3b: 'mysql_git',
  soal3c: 'mysql_git',
  soal3d: 'mysql_git',
  soal4a: 'problem_solving',
  soal4b: 'problem_solving',
  soal4c: 'problem_solving',
  soal4d: 'problem_solving',
  soal5a: 'ai_automation',
  soal5b: 'ai_automation',
  soal5c: 'ai_automation'
};
