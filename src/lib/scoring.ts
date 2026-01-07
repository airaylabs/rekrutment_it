import { TechnicalAnswers, PsikotesAnswers, TechnicalScores, PsikotesScores } from './types';

// Pollinations AI untuk scoring technical test
export async function scoreTechnicalWithAI(answers: TechnicalAnswers): Promise<TechnicalScores> {
  const prompt = `Kamu adalah evaluator technical test untuk posisi IT Staff Developer. Evaluasi jawaban kandidat dan berikan skor 1-10 untuk setiap soal.

KRITERIA:
- 1-3: Tidak memahami / salah
- 4-5: Memahami sebagian
- 6-7: Cukup baik
- 8-9: Bagus dengan reasoning baik
- 10: Excellent

KUNCI JAWABAN:
SOAL 1 (Problem Solving): Error di baris division count($result) ketika kosong. Fix: cek isEmpty() di awal.
SOAL 2 (Database): Query GROUP BY MONTH dengan WHERE status='completed'. Index: (status, created_at).
SOAL 3 (Git): git stash → checkout main → hotfix → merge → checkout feature → stash pop. Merge vs Rebase.
SOAL 4 (Multi-Project): Prioritas deadline terdekat dulu. Komunikasi jika kompleks.
SOAL 5 (AI): HTTP client, API key di env, Service class. Keamanan: env var, rate limit. Contoh: chatbot, summarization.

JAWABAN KANDIDAT:
Soal 1a: ${answers.soal1a}
Soal 1b: ${answers.soal1b}
Soal 2a: ${answers.soal2a}
Soal 2b: ${answers.soal2b}
Soal 3a: ${answers.soal3a}
Soal 3b: ${answers.soal3b}
Soal 4a: ${answers.soal4a}
Soal 4b: ${answers.soal4b}
Soal 5a: ${answers.soal5a}
Soal 5b: ${answers.soal5b}
Soal 5c: ${answers.soal5c}

BERIKAN RESPONSE DALAM FORMAT JSON SAJA (tanpa markdown):
{"soal1":X,"soal2":X,"soal3":X,"soal4":X,"soal5":X,"feedback":["feedback1","feedback2"]}`;

  try {
    const encodedPrompt = encodeURIComponent(prompt);
    const response = await fetch(`https://text.pollinations.ai/${encodedPrompt}`, {
      method: 'GET',
    });
    
    const text = await response.text();
    
    // Try to parse JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      const total = (parsed.soal1 + parsed.soal2 + parsed.soal3 + parsed.soal4 + parsed.soal5) / 5;
      return {
        soal1: parsed.soal1 || 5,
        soal2: parsed.soal2 || 5,
        soal3: parsed.soal3 || 5,
        soal4: parsed.soal4 || 5,
        soal5: parsed.soal5 || 5,
        total: Math.round(total * 10) / 10,
        feedback: parsed.feedback || ['Evaluasi selesai']
      };
    }
    
    // Fallback jika parsing gagal
    return fallbackTechnicalScoring(answers);
  } catch (error) {
    console.error('AI scoring error:', error);
    return fallbackTechnicalScoring(answers);
  }
}

// Fallback scoring jika AI gagal
function fallbackTechnicalScoring(answers: TechnicalAnswers): TechnicalScores {
  const scoreAnswer = (answer: string, keywords: string[]): number => {
    if (!answer || answer.trim().length < 10) return 2;
    const lowerAnswer = answer.toLowerCase();
    let score = 4; // Base score
    keywords.forEach(keyword => {
      if (lowerAnswer.includes(keyword.toLowerCase())) score += 1;
    });
    return Math.min(score, 10);
  };

  const soal1 = scoreAnswer(answers.soal1a + answers.soal1b, ['division', 'zero', 'count', 'empty', 'isempty', 'kosong', 'cek', 'if']);
  const soal2 = scoreAnswer(answers.soal2a + answers.soal2b, ['select', 'group by', 'month', 'sum', 'index', 'status', 'created_at']);
  const soal3 = scoreAnswer(answers.soal3a + answers.soal3b, ['stash', 'checkout', 'hotfix', 'merge', 'rebase', 'branch']);
  const soal4 = scoreAnswer(answers.soal4a + answers.soal4b, ['prioritas', 'deadline', 'urgent', 'komunikasi', 'stakeholder']);
  const soal5 = scoreAnswer(answers.soal5a + answers.soal5b + answers.soal5c, ['api', 'env', 'http', 'keamanan', 'rate limit', 'chatbot']);

  const total = (soal1 + soal2 + soal3 + soal4 + soal5) / 5;

  return {
    soal1, soal2, soal3, soal4, soal5,
    total: Math.round(total * 10) / 10,
    feedback: ['Evaluasi menggunakan keyword matching']
  };
}

// Rule-based scoring untuk psikotes (lebih konsisten)
export function scorePsikotes(answers: PsikotesAnswers): PsikotesScores {
  // Scenario scoring (ideal answers for RayCorp)
  const scenarioScores: Record<string, Record<string, number>> = {
    skenario1: { 'A': 2, 'B': 3, 'C': 5, 'D': 3, 'E': 4 },
    skenario2: { 'A': 3, 'B': 5, 'C': 4, 'D': 2, 'E': 4 },
    skenario3: { 'A': 1, 'B': 3, 'C': 5, 'D': 4, 'E': 4 }
  };

  const s1 = scenarioScores.skenario1[answers.skenario1] || 3;
  const s2 = scenarioScores.skenario2[answers.skenario2] || 3;
  const s3 = scenarioScores.skenario3[answers.skenario3] || 3;

  // Dimension calculations (scale 1-5 → 1-10)
  const multiProjectRaw = (s1 + answers.b1 + answers.b6 + answers.b9) / 4;
  const multiProject = multiProjectRaw * 2;

  const learningRaw = (s2 + answers.b2 + answers.b8 + answers.b10) / 4;
  const learning = learningRaw * 2;

  const initiativeRaw = (s3 + answers.b5 + answers.b8) / 3;
  const initiative = initiativeRaw * 2;

  const teamRaw = (answers.b3 + answers.b7) / 2;
  const team = teamRaw * 2;

  const changeRaw = (s2 + answers.b4 + answers.b6) / 3;
  const change = changeRaw * 2;

  // Weighted total
  const total = (
    (multiProject * 0.25) +
    (learning * 0.25) +
    (initiative * 0.20) +
    (team * 0.15) +
    (change * 0.15)
  );

  // Generate feedback
  let feedback = '';
  if (total >= 9) {
    feedback = 'Excellent fit! Sangat cocok dengan budaya kerja RayCorp.';
  } else if (total >= 8) {
    feedback = 'Good fit! Cocok dengan budaya kerja RayCorp.';
  } else if (total >= 6) {
    feedback = 'Moderate fit. Ada beberapa area yang perlu didiskusikan.';
  } else {
    feedback = 'Perlu evaluasi lebih lanjut untuk kecocokan budaya.';
  }

  return {
    multiProject: Math.round(multiProject * 10) / 10,
    learning: Math.round(learning * 10) / 10,
    initiative: Math.round(initiative * 10) / 10,
    team: Math.round(team * 10) / 10,
    change: Math.round(change * 10) / 10,
    total: Math.round(total * 10) / 10,
    feedback
  };
}

// Generate unique ID
export function generateId(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `RC-${timestamp}${random}`;
}
