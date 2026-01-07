# Setup Guide - RayCorp Recruitment System

## 🚀 Quick Start (Development)

```bash
cd recruitment-web
npm install
npm run dev
```

- Form: http://localhost:3000
- Admin: http://localhost:3000/admin (password: `raycorp2026`)

Data tersimpan di localStorage browser untuk development.

---

## 🌐 Deploy ke Vercel (Production)

### Step 1: Push ke GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/your-username/raycorp-recruitment.git
git push -u origin main
```

### Step 2: Import di Vercel
1. Buka https://vercel.com
2. Import repository
3. Deploy

### Step 3: Setup Vercel Storage

#### Vercel Blob (untuk CV)
1. Di Vercel dashboard, buka project
2. Storage → Create Database → Blob
3. Connect ke project
4. Token otomatis tersedia

#### Vercel KV (untuk data applicants)
1. Storage → Create Database → KV
2. Connect ke project
3. Environment variables otomatis tersedia

---

## 📧 Setup Email via n8n (UNLIMITED & GRATIS)

### Step 1: Setup n8n
Jika belum punya n8n:
- Self-hosted: https://docs.n8n.io/hosting/
- Cloud: https://n8n.io (free tier available)

### Step 2: Import Workflow
1. Buka n8n
2. Import workflow dari file `n8n-email-workflow.json`

### Step 3: Setup SMTP Credential
1. Di n8n, buka Settings → Credentials
2. Add credential → SMTP
3. Isi dengan SMTP Hostinger:
   - Host: `smtp.hostinger.com`
   - Port: `465`
   - User: `it@rayandra.com`
   - Password: [password email Anda]
   - SSL/TLS: Yes

### Step 4: Activate Workflow
1. Klik toggle Active
2. Copy Webhook URL (Production)

### Step 5: Add to Vercel Environment
Di Vercel dashboard → Settings → Environment Variables:
```
N8N_WEBHOOK_URL=https://your-n8n.com/webhook/raycorp-recruitment
```

Redeploy project.

---

## 🔐 Admin Dashboard

**URL:** https://your-domain.vercel.app/admin  
**Password:** `raycorp2026`

### Fitur:
- ✅ Lihat semua pelamar
- ✅ Filter: Semua / Score ≥ 8 / Score < 8
- ✅ Sort: Terbaru / Score Tertinggi
- ✅ Lihat & download CV
- ✅ Detail score per kategori
- ✅ Link langsung ke WhatsApp kandidat
- ✅ Statistik: Total, Pass, Fail, Rata-rata

### Ganti Password:
Edit `src/app/admin/page.tsx`:
```javascript
const ADMIN_PASSWORD = 'password_baru_anda';
```

---

## 📱 Flow Lengkap

```
Kandidat buka website
       ↓
Step 1: Isi data diri + Upload CV
       ↓ (CV otomatis dikompresi jika gambar)
Step 2: Technical Test (5 soal)
       ↓ (AI scoring via Pollinations)
Step 3: Psikotes
       ↓ (Rule-based scoring)
Step 4: Lihat hasil (tanpa status lulus/tidak)
       ↓
Data tersimpan ke:
├── Vercel KV (database)
├── Vercel Blob (CV files)
└── n8n → Email ke it@rayandra.com
       ↓
Tim HR review di Admin Dashboard
       ↓
Hubungi kandidat via WA/Email
```

---

## 📊 Scoring System

### Technical Test (60% weight)
- AI scoring via Pollinations (gratis, unlimited)
- 5 soal: Problem Solving, Database, Git, Multi-Project, AI
- Scale 1-10

### Psikotes (40% weight)
- Rule-based scoring (konsisten)
- 5 dimensi: Multi-Project, Learning, Initiative, Team, Change
- Scale 1-10

### Overall Score
```
Overall = (Technical × 0.6) + (Psikotes × 0.4)
```

---

## 🔗 Short Links

Setelah deploy, buat short link:
- `bit.ly/lamarraycorp` → https://your-domain.vercel.app
- `bit.ly/adminraycorp` → https://your-domain.vercel.app/admin (internal)

---

## ❓ Troubleshooting

### CV tidak terupload
- Cek Vercel Blob sudah di-setup
- Cek file size < 5MB
- Cek format file (PDF/JPG/PNG/DOC)

### Data tidak muncul di Admin
- Cek Vercel KV sudah di-setup
- Coba refresh browser
- Cek localStorage (fallback)

### Email tidak terkirim
- Cek n8n workflow aktif
- Cek SMTP credential benar
- Cek webhook URL di environment variable

### AI scoring error
- Pollinations API mungkin down
- Fallback ke keyword-based scoring otomatis

---

## 💰 Cost

| Service | Cost |
|---------|------|
| Vercel Hosting | Free (hobby) |
| Vercel Blob | Free 1GB |
| Vercel KV | Free 256MB |
| Pollinations AI | Free unlimited |
| n8n (self-hosted) | Free |
| SMTP Hostinger | Sudah include di hosting |

**Total: $0/bulan** untuk 1000+ applicants

---

*RayCorp Recruitment System - January 2026*
