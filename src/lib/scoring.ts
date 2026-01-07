import { TechnicalAnswers, PsikotesAnswers, TechnicalScores, PsikotesScores, TechnicalScoreDetails, PsikotesScoreDetails } from './types';
import { technicalAnswerKeys, categoryWeights, questionCategories, psikotesSkenario, psikotesStatements } from './questions';

// ============================================
// TECHNICAL SCORING - 100% AKURAT
// Semua pilihan ganda, tidak ada interpretasi
// ============================================

export function scoreTechnical(answers: TechnicalAnswers): TechnicalScores {
  const details: TechnicalScoreDetails = {};
  
  // Count correct answers per category
  const categoryCorrect: Record<string, number> = {
    php_laravel: 0,
    mysql_git: 0,
    problem_solving: 0,
    ai_automation: 0
  };
  
  const categoryTotal: Record<string, number> = {
    php_laravel: 5,    // 5 soal
    mysql_git: 8,      // 4 MySQL + 4 Git
    problem_solving: 4, // 4 soal
    ai_automation: 3   // 3 soal
  };

  // Score each question
  Object.keys(technicalAnswerKeys).forEach(questionId => {
    const key = questionId as keyof TechnicalAnswers;
    const userAnswer = answers[key] || '';
    const correctAnswer = technicalAnswerKeys[questionId].correct;
    const isCorrect = userAnswer.toUpperCase() === correctAnswer.toUpperCase();
    
    // Store detail
    details[questionId] = {
      answer: userAnswer,
      correct: isCorrect,
      correctAnswer: correctAnswer
    };
    
    // Add to category count
    const category = questionCategories[questionId];
    if (isCorrect && category) {
      categoryCorrect[category]++;
    }
  });

  // Calculate score per category (0-10 scale)
  const phpLaravel = Math.round((categoryCorrect.php_laravel / categoryTotal.php_laravel) * 10 * 10) / 10;
  const mysqlGit = Math.round((categoryCorrect.mysql_git / categoryTotal.mysql_git) * 10 * 10) / 10;
  const problemSolving = Math.round((categoryCorrect.problem_solving / categoryTotal.problem_solving) * 10 * 10) / 10;
  const aiAutomation = Math.round((categoryCorrect.ai_automation / categoryTotal.ai_automation) * 10 * 10) / 10;

  // Calculate weighted total
  // PHP/Laravel: 35%, MySQL/Git: 25%, Problem Solving: 25%, AI: 15%
  const total = Math.round((
    (phpLaravel * categoryWeights.php_laravel) +
    (mysqlGit * categoryWeights.mysql_git) +
    (problemSolving * categoryWeights.problem_solving) +
    (aiAutomation * categoryWeights.ai_automation)
  ) * 10) / 10;

  // Generate feedback
  const feedback: string[] = [];
  if (phpLaravel < 6) feedback.push('Perlu improve di PHP/Laravel - ini skill utama yang dibutuhkan');
  if (mysqlGit < 6) feedback.push('Perlu improve di MySQL & Git');
  if (problemSolving < 6) feedback.push('Perlu improve di Problem Solving');
  if (aiAutomation < 6) feedback.push('Familiar dengan AI/Automation akan jadi nilai plus');
  
  if (feedback.length === 0) {
    if (total >= 8) {
      feedback.push('Technical skill sangat baik!');
    } else {
      feedback.push('Technical skill cukup baik');
    }
  }

  return {
    phpLaravel,
    mysqlGit,
    problemSolving,
    aiAutomation,
    total,
    details,
    feedback
  };
}

// ============================================
// PSIKOTES SCORING - RULE-BASED
// Konsisten dan akurat
// ============================================

export function scorePsikotes(answers: PsikotesAnswers): PsikotesScores {
  const details: PsikotesScoreDetails = {
    skenario1: { answer: '', idealAnswer: '', score: 0 },
    skenario2: { answer: '', idealAnswer: '', score: 0 },
    skenario3: { answer: '', idealAnswer: '', score: 0 },
    statements: {},
    c2: answers.c2,
    d1: answers.d1,
    d2: answers.d2
  };

  // Score skenario
  const skenario1Data = psikotesSkenario.find(s => s.id === 'skenario1')!;
  const skenario2Data = psikotesSkenario.find(s => s.id === 'skenario2')!;
  const skenario3Data = psikotesSkenario.find(s => s.id === 'skenario3')!;
  
  const s1Score = skenario1Data.scoring[answers.skenario1 as keyof typeof skenario1Data.scoring] || 3;
  const s2Score = skenario2Data.scoring[answers.skenario2 as keyof typeof skenario2Data.scoring] || 3;
  const s3Score = skenario3Data.scoring[answers.skenario3 as keyof typeof skenario3Data.scoring] || 3;
  
  details.skenario1 = { 
    answer: answers.skenario1, 
    idealAnswer: skenario1Data.idealAnswer, 
    score: s1Score 
  };
  details.skenario2 = { 
    answer: answers.skenario2, 
    idealAnswer: skenario2Data.idealAnswer, 
    score: s2Score 
  };
  details.skenario3 = { 
    answer: answers.skenario3, 
    idealAnswer: skenario3Data.idealAnswer, 
    score: s3Score 
  };

  // Store statement answers
  psikotesStatements.forEach(stmt => {
    const key = stmt.id as keyof PsikotesAnswers;
    details.statements[stmt.id] = answers[key] as number;
  });

  // Calculate dimension scores (scale 1-5 → 1-10)
  const multiProjectRaw = (s1Score + answers.b1 + answers.b6 + answers.b9) / 4;
  const multiProject = Math.round(multiProjectRaw * 2 * 10) / 10;

  const learningRaw = (s2Score + answers.b2 + answers.b8 + answers.b10) / 4;
  const learning = Math.round(learningRaw * 2 * 10) / 10;

  const initiativeRaw = (s3Score + answers.b5 + answers.b8) / 3;
  const initiative = Math.round(initiativeRaw * 2 * 10) / 10;

  const teamRaw = (answers.b3 + answers.b7) / 2;
  const team = Math.round(teamRaw * 2 * 10) / 10;

  const changeRaw = (s2Score + answers.b4 + answers.b6) / 3;
  const change = Math.round(changeRaw * 2 * 10) / 10;

  // Weighted total
  const total = Math.round((
    (multiProject * 0.25) +
    (learning * 0.25) +
    (initiative * 0.20) +
    (team * 0.15) +
    (change * 0.15)
  ) * 10) / 10;

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
    multiProject,
    learning,
    initiative,
    team,
    change,
    total,
    feedback,
    details
  };
}

// ============================================
// OVERALL SCORING
// Technical: 70%, Psikotes: 30%
// ============================================

export function calculateOverallScore(technicalTotal: number, psikotesTotal: number): number {
  // Technical 70%, Psikotes 30%
  return Math.round(((technicalTotal * 0.7) + (psikotesTotal * 0.3)) * 10) / 10;
}

// Generate unique ID
export function generateId(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `RC-${timestamp}${random}`;
}

// Convert file to base64 for storage
export async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
}
