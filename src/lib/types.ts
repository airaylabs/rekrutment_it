export interface PersonalData {
  nama: string;
  email: string;
  whatsapp: string;
  cvFile: File | null;
  cvFileName: string;
}

export interface TechnicalAnswers {
  soal1a: string;
  soal1b: string;
  soal2a: string;
  soal2b: string;
  soal3a: string;
  soal3b: string;
  soal4a: string;
  soal4b: string;
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
  soal1: number;
  soal2: number;
  soal3: number;
  soal4: number;
  soal5: number;
  total: number;
  feedback: string[];
}

export interface PsikotesScores {
  multiProject: number;
  learning: number;
  initiative: number;
  team: number;
  change: number;
  total: number;
  feedback: string;
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
}

export interface FormState {
  step: number;
  personal: PersonalData;
  technical: TechnicalAnswers;
  psikotes: PsikotesAnswers;
  isSubmitting: boolean;
  result: FinalResult | null;
}
