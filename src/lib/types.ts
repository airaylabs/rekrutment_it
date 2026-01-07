export interface PersonalData {
  nama: string;
  email: string;
  whatsapp: string;
  cvFile: File | null;
  cvFileName: string;
}

// 20 soal pilihan ganda
export interface TechnicalAnswers {
  // Soal 1: PHP/Laravel (5 soal)
  soal1a: string;
  soal1b: string;
  soal1c: string;
  soal1d: string;
  soal1e: string;
  // Soal 2: MySQL (4 soal)
  soal2a: string;
  soal2b: string;
  soal2c: string;
  soal2d: string;
  // Soal 3: Git (4 soal)
  soal3a: string;
  soal3b: string;
  soal3c: string;
  soal3d: string;
  // Soal 4: Problem Solving (4 soal)
  soal4a: string;
  soal4b: string;
  soal4c: string;
  soal4d: string;
  // Soal 5: AI/Automation (3 soal)
  soal5a: string;
  soal5b: string;
  soal5c: string;
}

export interface PsikotesAnswers {
  skenario1: string;
  skenario2: string;
  skenario3: string;
  b1: number;
  b2: number;
  b3: number;
  b4: number;
  b5: number;
  b6: number;
  b7: number;
  b8: number;
  b9: number;
  b10: number;
  c1: string;
  c2: string;
  d1: string;
  d2: string;
}

export interface TechnicalScores {
  // Score per kategori (0-10)
  phpLaravel: number;     // 35%
  mysqlGit: number;       // 25%
  problemSolving: number; // 25%
  aiAutomation: number;   // 15%
  // Total weighted score
  total: number;
  // Detail per soal
  details: TechnicalScoreDetails;
  // Feedback
  feedback: string[];
}

export interface TechnicalScoreDetails {
  [key: string]: {
    answer: string;
    correct: boolean;
    correctAnswer: string;
  };
}

export interface PsikotesScores {
  multiProject: number;
  learning: number;
  initiative: number;
  team: number;
  change: number;
  total: number;
  feedback: string;
  details?: PsikotesScoreDetails;
}

export interface PsikotesScoreDetails {
  skenario1: { answer: string; idealAnswer: string; score: number };
  skenario2: { answer: string; idealAnswer: string; score: number };
  skenario3: { answer: string; idealAnswer: string; score: number };
  statements: { [key: string]: number };
  c2: string;
  d1: string;
  d2: string;
}

// Timer tracking
export interface TimerData {
  startTime: number;
  personalDuration: number;  // dalam detik
  technicalDuration: number; // dalam detik
  psikotesDuration: number;  // dalam detik
  totalDuration: number;     // dalam detik
}

export interface FinalResult {
  id: string;
  timestamp: string;
  personal: PersonalData;
  technical: TechnicalScores;
  psikotes: PsikotesScores;
  overallScore: number;
  status: 'LULUS' | 'TIDAK LULUS';
  cvUrl: string;
  timer?: TimerData;
}

export interface FormState {
  step: number;
  personal: PersonalData;
  technical: TechnicalAnswers;
  psikotes: PsikotesAnswers;
  isSubmitting: boolean;
  result: FinalResult | null;
  // Timer
  startTime: number;
  stepStartTime: number;
  personalDuration: number;
  technicalDuration: number;
  psikotesDuration: number;
}

// For admin dashboard
export interface ApplicantData {
  id: string;
  timestamp: string;
  nama: string;
  email: string;
  whatsapp: string;
  cvUrl: string;
  cvFileName?: string;
  cvBase64?: string;
  cvMimeType?: string;
  // Technical scores
  technicalScore: number;
  technicalDetail?: {
    phpLaravel?: number;
    mysqlGit?: number;
    problemSolving?: number;
    aiAutomation?: number;
  };
  technicalAnswers?: TechnicalAnswers;
  technicalScoreDetails?: TechnicalScoreDetails;
  // Psikotes scores
  psikotesScore: number;
  psikotesDetail?: {
    multiProject?: number;
    learning?: number;
    initiative?: number;
    team?: number;
    change?: number;
  };
  psikotesAnswers?: PsikotesAnswers;
  psikotesScoreDetails?: PsikotesScoreDetails;
  // Overall
  overallScore: number;
  status: string;
  // Timer
  timer?: TimerData;
}
