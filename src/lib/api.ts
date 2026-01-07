import { FinalResult } from './types';

// Upload CV ke server
export async function uploadCV(file: File): Promise<string> {
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData
    });
    
    const data = await response.json();
    if (data.success) {
      return data.url;
    }
    return `[CV: ${file.name}]`;
  } catch (error) {
    console.error('Upload error:', error);
    return `[CV: ${file.name}]`;
  }
}

// Simpan applicant ke database
export async function saveApplicant(result: FinalResult): Promise<boolean> {
  try {
    // Save to server API (Vercel KV)
    const response = await fetch('/api/applicants', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: result.id,
        timestamp: result.timestamp,
        nama: result.personal.nama,
        email: result.personal.email,
        whatsapp: result.personal.whatsapp,
        cvUrl: result.cvUrl,
        cvFileName: result.personal.cvFileName,
        technicalScore: result.technical.total,
        technicalDetail: {
          soal1: result.technical.soal1,
          soal2: result.technical.soal2,
          soal3: result.technical.soal3,
          soal4: result.technical.soal4,
          soal5: result.technical.soal5,
        },
        psikotesScore: result.psikotes.total,
        psikotesDetail: {
          multiProject: result.psikotes.multiProject,
          learning: result.psikotes.learning,
          initiative: result.psikotes.initiative,
          team: result.psikotes.team,
          change: result.psikotes.change,
        },
        overallScore: result.overallScore,
        status: result.status
      })
    });
    
    // Also save to localStorage as backup
    saveToLocalStorage(result);
    
    return response.ok;
  } catch (error) {
    console.error('Save error:', error);
    // Fallback to localStorage
    saveToLocalStorage(result);
    return false;
  }
}

// Backup ke localStorage
function saveToLocalStorage(result: FinalResult): void {
  try {
    const stored = localStorage.getItem('raycorp_applicants');
    const applicants = stored ? JSON.parse(stored) : [];
    
    applicants.unshift({
      id: result.id,
      timestamp: result.timestamp,
      nama: result.personal.nama,
      email: result.personal.email,
      whatsapp: result.personal.whatsapp,
      cvUrl: result.cvUrl,
      cvFileName: result.personal.cvFileName,
      technicalScore: result.technical.total,
      technicalDetail: {
        soal1: result.technical.soal1,
        soal2: result.technical.soal2,
        soal3: result.technical.soal3,
        soal4: result.technical.soal4,
        soal5: result.technical.soal5,
      },
      psikotesScore: result.psikotes.total,
      psikotesDetail: {
        multiProject: result.psikotes.multiProject,
        learning: result.psikotes.learning,
        initiative: result.psikotes.initiative,
        team: result.psikotes.team,
        change: result.psikotes.change,
      },
      overallScore: result.overallScore,
      status: result.status
    });
    
    localStorage.setItem('raycorp_applicants', JSON.stringify(applicants));
  } catch (error) {
    console.error('LocalStorage error:', error);
  }
}

// Kirim notifikasi ke n8n (untuk email via SMTP)
export async function sendNotification(result: FinalResult): Promise<boolean> {
  try {
    const response = await fetch('/api/notify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: result.id,
        timestamp: result.timestamp,
        nama: result.personal.nama,
        email: result.personal.email,
        whatsapp: result.personal.whatsapp,
        cvUrl: result.cvUrl,
        technicalScore: result.technical.total,
        technicalDetail: `Problem Solving: ${result.technical.soal1}/10, Database: ${result.technical.soal2}/10, Git: ${result.technical.soal3}/10, Multi-Project: ${result.technical.soal4}/10, AI: ${result.technical.soal5}/10`,
        psikotesScore: result.psikotes.total,
        psikotesDetail: `Multi-Project: ${result.psikotes.multiProject}/10, Learning: ${result.psikotes.learning}/10, Initiative: ${result.psikotes.initiative}/10, Team: ${result.psikotes.team}/10, Change: ${result.psikotes.change}/10`,
        overallScore: result.overallScore,
        status: result.status
      })
    });
    
    return response.ok;
  } catch (error) {
    console.error('Notification error:', error);
    return false;
  }
}
