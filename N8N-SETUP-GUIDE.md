# 📧 Setup n8n Email Notification - RayCorp Recruitment

## Langkah 1: Buat Workflow di n8n

### A. Tambah Node Webhook
1. Buka n8n dashboard
2. Create new workflow
3. Add node: **Webhook**
4. Settings:
   - HTTP Method: `POST`
   - Path: `raycorp-recruitment`
   - Response Mode: `When Last Node Finishes`
5. Copy Webhook URL (contoh: `https://your-n8n.com/webhook/raycorp-recruitment`)

### B. Tambah Node Email Send
1. Add node: **Email Send (SMTP)**
2. Connect dari Webhook ke Email Send
3. Settings:

**From Email:**
```
={{ $env.SMTP_USER }}
```
atau langsung: `noreply@rayandra.com`

**To Email:**
```
it@rayandra.com
```

**Subject:**
```
=[IT-RECRUITMENT] {{ $json.nama }} - Score: {{ $json.overallScore }}/10 - {{ $json.status }}
```

**Email Type:** HTML

**HTML Content:** (copy dari bawah)

---

## Langkah 2: HTML Email Template

Copy paste ini ke field HTML di n8n:

```html
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; background: #1a1a2e; color: #eee; padding: 20px; }
    .container { max-width: 600px; margin: 0 auto; background: #16213e; border-radius: 10px; padding: 30px; }
    .header { text-align: center; border-bottom: 2px solid #0f3460; padding-bottom: 20px; margin-bottom: 20px; }
    .header h1 { color: #4da8da; margin: 0; }
    .score-big { font-size: 48px; font-weight: bold; }
    .section { background: #0f3460; border-radius: 8px; padding: 15px; margin-bottom: 15px; }
    .section h3 { color: #4da8da; margin-top: 0; border-bottom: 1px solid #1a1a2e; padding-bottom: 10px; }
    .row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #1a1a2e; }
    .row:last-child { border-bottom: none; }
    .label { color: #9ca3af; }
    .value { color: #fff; font-weight: bold; }
    .good { color: #4ade80; }
    .warning { color: #facc15; }
    .followup { border-radius: 8px; padding: 15px; margin-top: 20px; }
    .followup-high { background: #166534; }
    .followup-medium { background: #1e40af; }
    .followup-low { background: #854d0e; }
    .followup-reject { background: #7f1d1d; }
    .btn { display: inline-block; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 5px; color: #fff; }
    .btn-wa { background: #25d366; }
    .btn-admin { background: #8b5cf6; }
    .footer { text-align: center; margin-top: 20px; color: #6b7280; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎯 LAMARAN BARU</h1>
      <p style="color: #9ca3af;">IT Staff Developer</p>
      <div class="score-big" style="color: {{ $json.overallScore >= 8 ? '#4ade80' : '#facc15' }};">{{ $json.overallScore }}/10</div>
      <p style="color: {{ $json.overallScore >= 8 ? '#4ade80' : '#facc15' }}; font-size: 18px;">{{ $json.status }}</p>
    </div>

    <div class="section">
      <h3>👤 DATA KANDIDAT</h3>
      <div class="row"><span class="label">ID Lamaran</span><span class="value">{{ $json.id }}</span></div>
      <div class="row"><span class="label">Nama</span><span class="value">{{ $json.nama }}</span></div>
      <div class="row"><span class="label">Email</span><span class="value">{{ $json.email }}</span></div>
      <div class="row"><span class="label">WhatsApp</span><span class="value">{{ $json.whatsapp }}</span></div>
      <div class="row"><span class="label">CV</span><span class="value">{{ $json.cvFileName || 'Lihat di Admin Dashboard' }}</span></div>
    </div>

    <div class="section">
      <h3>💻 TECHNICAL TEST (Bobot 70%)</h3>
      <div class="row"><span class="label">Total Score</span><span class="value {{ $json.technicalScore >= 8 ? 'good' : 'warning' }}">{{ $json.technicalScore }}/10</span></div>
      <div class="row"><span class="label">PHP/Laravel (35%)</span><span class="value">{{ $json.phpLaravel }}/10</span></div>
      <div class="row"><span class="label">MySQL & Git (25%)</span><span class="value">{{ $json.mysqlGit }}/10</span></div>
      <div class="row"><span class="label">Problem Solving (25%)</span><span class="value">{{ $json.problemSolving }}/10</span></div>
      <div class="row"><span class="label">AI/Automation (15%)</span><span class="value">{{ $json.aiAutomation }}/10</span></div>
    </div>

    <div class="section">
      <h3>🧠 PSIKOTES (Bobot 30%)</h3>
      <div class="row"><span class="label">Total Score</span><span class="value {{ $json.psikotesScore >= 8 ? 'good' : 'warning' }}">{{ $json.psikotesScore }}/10</span></div>
      <div class="row"><span class="label">Multi-Project</span><span class="value">{{ $json.multiProject }}/10</span></div>
      <div class="row"><span class="label">Learning Agility</span><span class="value">{{ $json.learning }}/10</span></div>
      <div class="row"><span class="label">Initiative</span><span class="value">{{ $json.initiative }}/10</span></div>
      <div class="row"><span class="label">Team Collaboration</span><span class="value">{{ $json.team }}/10</span></div>
      <div class="row"><span class="label">Change Tolerance</span><span class="value">{{ $json.change }}/10</span></div>
    </div>

    <div class="section">
      <h3>⏱️ WAKTU PENGERJAAN</h3>
      <div class="row"><span class="label">Data Diri</span><span class="value">{{ $json.timer.personal }}</span></div>
      <div class="row"><span class="label">Technical Test</span><span class="value">{{ $json.timer.technical }}</span></div>
      <div class="row"><span class="label">Psikotes</span><span class="value">{{ $json.timer.psikotes }}</span></div>
      <div class="row"><span class="label">Total Waktu</span><span class="value" style="color: #4da8da;">{{ $json.timer.total }}</span></div>
      <div class="row"><span class="label">Evaluasi Kecepatan</span><span class="value">{{ $json.speedEval }}</span></div>
    </div>

    <div class="followup followup-{{ $json.priority.toLowerCase() }}">
      <h3 style="color: #fff; margin-top: 0;">📋 REKOMENDASI FOLLOW-UP</h3>
      <p style="font-size: 16px; margin: 0; color: #fff;">{{ $json.followUp }}</p>
    </div>

    <div style="text-align: center; margin-top: 20px;">
      <a href="{{ $json.whatsappLink }}" class="btn btn-wa">💬 WhatsApp Kandidat</a>
      <a href="{{ $json.adminLink }}" class="btn btn-admin">🔐 Admin Dashboard</a>
    </div>

    <div class="footer">
      <p>Email ini dikirim otomatis oleh RayCorp Recruitment System</p>
      <p>{{ $json.timestamp }}</p>
    </div>
  </div>
</body>
</html>
```

---

## Langkah 3: Setup SMTP Credentials di n8n

1. Go to **Credentials** di n8n
2. Add new credential: **SMTP**
3. Settings untuk Gmail:
   - Host: `smtp.gmail.com`
   - Port: `465`
   - SSL/TLS: `true`
   - User: `your-email@gmail.com`
   - Password: App Password (bukan password biasa)

4. Settings untuk Hostinger/Custom SMTP:
   - Host: `smtp.hostinger.com` atau sesuai provider
   - Port: `465`
   - SSL/TLS: `true`
   - User: `noreply@rayandra.com`
   - Password: password email

---

## Langkah 4: Update .env.local di Website

```env
N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/raycorp-recruitment
```

---

## Langkah 5: Test Workflow

1. Activate workflow di n8n
2. Submit test application di website
3. Cek email masuk

---

## Data yang Dikirim ke n8n

```json
{
  "id": "RC-XXXXX",
  "timestamp": "Rabu, 8 Januari 2026 pukul 10.30",
  "nama": "John Doe",
  "email": "john@example.com",
  "whatsapp": "081234567890",
  "whatsappLink": "https://wa.me/6281234567890",
  "cvFileName": "CV_John_Doe.pdf",
  
  "technicalScore": 8.5,
  "phpLaravel": 9,
  "mysqlGit": 8,
  "problemSolving": 8.5,
  "aiAutomation": 7,
  "technicalFeedback": "Technical skill sangat baik!",
  
  "psikotesScore": 8.2,
  "multiProject": 8,
  "learning": 9,
  "initiative": 8,
  "team": 8,
  "change": 8,
  "psikotesFeedback": "Good fit! Cocok dengan budaya kerja RayCorp.",
  
  "overallScore": 8.4,
  "status": "LULUS",
  
  "timer": {
    "personal": "2 menit 30 detik",
    "technical": "18 menit 45 detik",
    "psikotes": "8 menit 20 detik",
    "total": "29 menit 35 detik",
    "totalMinutes": 30
  },
  "speedEval": "✅ Cepat (Good)",
  
  "followUp": "✅ LULUS - Jadwalkan interview dalam minggu ini",
  "priority": "MEDIUM",
  
  "adminLink": "https://recruitment.rayandra.com/admin"
}
```

---

## Troubleshooting

### Email tidak terkirim?
1. Cek SMTP credentials sudah benar
2. Cek webhook URL di .env.local
3. Cek n8n workflow sudah active
4. Lihat execution log di n8n

### Data kosong di email?
1. Pastikan menggunakan `{{ $json.fieldName }}` bukan `{{ fieldName }}`
2. Cek data yang masuk di webhook (lihat di execution log)

### CV tidak muncul?
CV disimpan sebagai base64 di database, terlalu besar untuk email.
Lihat CV di Admin Dashboard: `/admin`
