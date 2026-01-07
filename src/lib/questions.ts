export const technicalQuestions = [
  {
    id: 'soal1',
    title: 'SOAL 1: Problem Solving & Debugging',
    description: `Tim RayCorp sedang develop website e-commerce. Code berikut error saat menampilkan daftar produk:

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
      { id: 'soal1a', label: 'a) Jelaskan mengapa error terjadi dan di baris mana?' },
      { id: 'soal1b', label: 'b) Tulis perbaikan code-nya' }
    ]
  },
  {
    id: 'soal2',
    title: 'SOAL 2: Database & Query',
    description: `RayCorp punya tabel \`orders\` dengan jutaan data. Tim butuh laporan "Total penjualan per bulan di tahun 2025".

\`\`\`sql
CREATE TABLE orders (
    id INT PRIMARY KEY,
    customer_id INT,
    total_amount DECIMAL(12,2),
    status ENUM('pending', 'paid', 'shipped', 'completed', 'cancelled'),
    created_at DATETIME
);
\`\`\``,
    questions: [
      { id: 'soal2a', label: 'a) Tulis query untuk total penjualan per bulan (hanya status \'completed\')' },
      { id: 'soal2b', label: 'b) Index apa yang perlu ditambahkan agar query optimal?' }
    ]
  }
];


export const technicalQuestions2 = [
  {
    id: 'soal3',
    title: 'SOAL 3: Git Version Control',
    description: `Anda sedang mengerjakan fitur baru di branch \`feature/payment\`. Tiba-tiba ada bug urgent di production yang harus segera diperbaiki.`,
    questions: [
      { id: 'soal3a', label: 'a) Jelaskan langkah-langkah handle situasi ini (dari save pekerjaan sampai kembali ke fitur)' },
      { id: 'soal3b', label: 'b) Apa perbedaan git merge dan git rebase? Kapan pakai masing-masing?' }
    ]
  },
  {
    id: 'soal4',
    title: 'SOAL 4: Multi-Project & Prioritas',
    description: `Anda handle 3 project sekaligus di RayCorp:

| Project | Deadline | Progress | Issue |
|---------|----------|----------|-------|
| Website Lunaray.id | Besok | 80% | Minor bug di checkout |
| ERP System | Minggu depan | 40% | Butuh integrasi API baru |
| Portal Artikel | 2 minggu lagi | 20% | Tidak ada issue |

Hari ini Anda juga diminta bantu onboarding developer baru (estimasi 2 jam).`,
    questions: [
      { id: 'soal4a', label: 'a) Bagaimana Anda memprioritaskan task hari ini? Urutkan dan jelaskan.' },
      { id: 'soal4b', label: 'b) Jika bug lebih kompleks dari perkiraan, apa yang Anda lakukan?' }
    ]
  },
  {
    id: 'soal5',
    title: 'SOAL 5: AI & Automation',
    description: `RayCorp ingin membuat sistem otomatis untuk generate deskripsi produk kosmetik menggunakan AI.`,
    questions: [
      { id: 'soal5a', label: 'a) Secara konsep, bagaimana mengintegrasikan AI (OpenAI API) ke Laravel?' },
      { id: 'soal5b', label: 'b) Apa yang perlu diperhatikan dari sisi keamanan dan biaya?' },
      { id: 'soal5c', label: 'c) Sebutkan 2 contoh lain penggunaan AI untuk efisiensi kerja' }
    ]
  }
];

export const psikotesSkenario = [
  {
    id: 'skenario1',
    title: 'Skenario 1: Multi-Project Pressure',
    description: 'Anda handle 2 project, deadline besok dan lusa. Rekan baru minta bantuan karena stuck 3 jam dengan error.',
    options: [
      { value: 'A', label: 'Fokus project sendiri, minta rekan cari solusi sendiri' },
      { value: 'B', label: 'Langsung bantu sampai selesai, deadline bisa dinego' },
      { value: 'C', label: 'Luangkan 15-20 menit kasih petunjuk, lalu kembali ke project' },
      { value: 'D', label: 'Minta rekan catat masalahnya, bantu setelah project selesai' },
      { value: 'E', label: 'Eskalasi ke lead bahwa ada konflik prioritas' }
    ]
  },
  {
    id: 'skenario2',
    title: 'Skenario 2: Perubahan Mendadak',
    description: 'Project 2 minggu di-cancel, harus pindah ke project baru dengan teknologi yang belum pernah dipakai.',
    options: [
      { value: 'A', label: 'Kecewa dan butuh waktu, tapi akan adaptasi' },
      { value: 'B', label: 'Excited dengan tantangan baru, langsung belajar' },
      { value: 'C', label: 'Netral, ini bagian dari pekerjaan' },
      { value: 'D', label: 'Frustrasi karena effort terbuang, tapi tetap profesional' },
      { value: 'E', label: 'Tanya management alasan perubahan untuk memahami konteks' }
    ]
  },
  {
    id: 'skenario3',
    title: 'Skenario 3: Ide vs Cara Kerja',
    description: 'Punya ide improvement workflow yang bisa hemat 30%, tapi cara kerja sudah ditetapkan.',
    options: [
      { value: 'A', label: 'Simpan ide untuk diri sendiri' },
      { value: 'B', label: 'Implementasi di pekerjaan sendiri tanpa ubah workflow tim' },
      { value: 'C', label: 'Sampaikan ke lead/manager dengan data dan alasan jelas' },
      { value: 'D', label: 'Diskusikan dulu dengan rekan setim untuk dapat feedback' },
      { value: 'E', label: 'Tunggu momen yang tepat seperti retrospective' }
    ]
  }
];


export const psikotesStatements = [
  { id: 'b1', text: 'Saya nyaman mengerjakan beberapa project secara bersamaan' },
  { id: 'b2', text: 'Saya excited ketika harus belajar teknologi atau tools baru' },
  { id: 'b3', text: 'Saya senang berbagi knowledge dan membantu rekan yang kesulitan' },
  { id: 'b4', text: 'Perubahan rencana mendadak tidak terlalu mengganggu saya' },
  { id: 'b5', text: 'Saya proaktif mencari solusi, bukan menunggu instruksi' },
  { id: 'b6', text: 'Saya bisa bekerja efektif meskipun requirement belum 100% jelas' },
  { id: 'b7', text: 'Saya nyaman menerima kritik dan feedback dari orang lain' },
  { id: 'b8', text: 'Saya berani mencoba pendekatan baru meskipun ada risiko gagal' },
  { id: 'b9', text: 'Saya bisa tetap fokus dan produktif meskipun ada tekanan deadline' },
  { id: 'b10', text: 'Saya rutin mengikuti perkembangan teknologi di luar jam kerja' }
];

export const psikotesC2Options = [
  { value: 'A', label: 'Coba selesaikan sendiri dulu sampai mentok' },
  { value: 'B', label: 'Langsung diskusi dengan tim untuk brainstorming' },
  { value: 'C', label: 'Riset di internet/dokumentasi' },
  { value: 'D', label: 'Tanya ke senior atau yang lebih berpengalaman' },
  { value: 'E', label: 'Kombinasi - riset dulu, kalau stuck baru tanya tim' }
];
