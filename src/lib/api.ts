import { FinalResult, ApplicantData } from './types';

// Simpan applicant ke database (dengan data lengkap)
export async function saveApplicant(data: ApplicantData): Promise<boolean> {
  try {
    const response = await fetch('/api/applicants', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    
    saveToLocalStorage(data);
    return response.ok;
  } catch (error) {
    console.error('Save error:', error);
    saveToLocalStorage(data);
    return false;
  }
}

// Backup ke localStorage
function saveToLocalStorage(data: ApplicantData): void {
  try {
    const stored = localStorage.getItem('raycorp_applicants');
    const applicants = stored ? JSON.parse(stored) : [];
    applicants.unshift(data);
    localStorage.setItem('raycorp_applicants', JSON.stringify(applicants));
  } catch (error) {
    console.error('LocalStorage error:', error);
  }
}

// Format duration untuk email
function formatDuration(seconds: number): string {
  if (!seconds) return '-';
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins} menit ${secs} detik`;
}

// Kirim notifikasi ke n8n (untuk email via SMTP)
export async function sendNotification(result: FinalResult): Promise<boolean> {
  try {
    // Determine follow-up recommendation
    let followUp = '';
    let priority = '';
    
    if (result.overallScore >= 9) {
      followUp = '🔥 PRIORITAS TINGGI - Segera jadwalkan interview dalam 1-2 hari';
      priority = 'HIGH';
    } else if (result.overallScore >= 8) {
      followUp = '✅ LULUS - Jadwalkan interview dalam minggu ini';
      priority = 'MEDIUM';
    } else if (result.overallScore >= 7) {
      followUp = '⚠️ PERTIMBANGKAN - Review manual, mungkin perlu interview untuk evaluasi lebih lanjut';
      priority = 'LOW';
    } else {
      followUp = '❌ TIDAK LULUS - Kirim email penolakan dengan sopan';
      priority = 'REJECT';
    }

    // Timer info
    const timerInfo = result.timer ? {
      personal: formatDuration(result.timer.personalDuration),
      technical: formatDuration(result.timer.technicalDuration),
      psikotes: formatDuration(result.timer.psikotesDuration),
      total: formatDuration(result.timer.totalDuration),
      totalMinutes: Math.round(result.timer.totalDuration / 60)
    } : null;

    // Speed evaluation
    let speedEval = '';
    if (timerInfo) {
      if (timerInfo.totalMinutes <= 25) {
        speedEval = '⚡ Sangat Cepat (Excellent)';
      } else if (timerInfo.totalMinutes <= 35) {
        speedEval = '✅ Cepat (Good)';
      } else if (timerInfo.totalMinutes <= 45) {
        speedEval = '⏱️ Normal';
      } else {
        speedEval = '🐢 Lambat (perlu evaluasi)';
      }
    }

    const response = await fetch('/api/notify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        // Identitas
        id: result.id,
        timestamp: result.timestamp,
        
        // Data Kandidat
        nama: result.personal.nama,
        email: result.personal.email,
        whatsapp: result.personal.whatsapp,
        whatsappLink: `https://wa.me/${result.personal.whatsapp.replace(/^0/, '62')}`,
        cvFileName: result.personal.cvFileName,
        
        // Technical Scores
        technicalScore: result.technical.total,
        phpLaravel: result.technical.phpLaravel,
        mysqlGit: result.technical.mysqlGit,
        problemSolving: result.technical.problemSolving,
        aiAutomation: result.technical.aiAutomation,
        technicalFeedback: result.technical.feedback.join(', '),
        
        // Psikotes Scores
        psikotesScore: result.psikotes.total,
        multiProject: result.psikotes.multiProject,
        learning: result.psikotes.learning,
        initiative: result.psikotes.initiative,
        team: result.psikotes.team,
        change: result.psikotes.change,
        psikotesFeedback: result.psikotes.feedback,
        
        // Overall
        overallScore: result.overallScore,
        status: result.status,
        
        // Timer
        timer: timerInfo,
        speedEval: speedEval,
        
        // Follow Up
        followUp: followUp,
        priority: priority,
        
        // Admin Link
        adminLink: `${typeof window !== 'undefined' ? window.location.origin : ''}/admin`
      })
    });
    
    return response.ok;
  } catch (error) {
    console.error('Notification error:', error);
    return false;
  }
}
