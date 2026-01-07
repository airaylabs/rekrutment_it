'use client';

import { useState } from 'react';
import LandingPage from '@/components/LandingPage';
import StepIndicator from '@/components/StepIndicator';
import Step1Personal from '@/components/Step1Personal';
import Step2Technical from '@/components/Step2Technical';
import Step3Psikotes from '@/components/Step3Psikotes';
import Step4Result from '@/components/Step4Result';
import { FormState, FinalResult, TimerData } from '@/lib/types';
import { scoreTechnical, scorePsikotes, calculateOverallScore, generateId, fileToBase64 } from '@/lib/scoring';
import { saveApplicant, sendNotification } from '@/lib/api';

const initialState: FormState = {
  step: 0, // 0 = landing page
  personal: { nama: '', email: '', whatsapp: '', cvFile: null, cvFileName: '' },
  technical: {
    soal1a: '', soal1b: '', soal1c: '', soal1d: '', soal1e: '',
    soal2a: '', soal2b: '', soal2c: '', soal2d: '',
    soal3a: '', soal3b: '', soal3c: '', soal3d: '',
    soal4a: '', soal4b: '', soal4c: '', soal4d: '',
    soal5a: '', soal5b: '', soal5c: ''
  },
  psikotes: {
    skenario1: '', skenario2: '', skenario3: '',
    b1: 0, b2: 0, b3: 0, b4: 0, b5: 0, b6: 0, b7: 0, b8: 0, b9: 0, b10: 0,
    c1: '', c2: '', d1: '', d2: ''
  },
  isSubmitting: false,
  result: null,
  // Timer
  startTime: 0,
  stepStartTime: 0,
  personalDuration: 0,
  technicalDuration: 0,
  psikotesDuration: 0
};

// Format duration to mm:ss
function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export default function Home() {
  const [state, setState] = useState<FormState>(initialState);

  const handleStart = () => {
    const now = Date.now();
    setState(prev => ({ 
      ...prev, 
      step: 1, 
      startTime: now,
      stepStartTime: now 
    }));
  };

  const handleNextStep = (nextStep: number) => {
    const now = Date.now();
    const duration = Math.floor((now - state.stepStartTime) / 1000);
    
    setState(prev => {
      const updates: Partial<FormState> = {
        step: nextStep,
        stepStartTime: now
      };
      
      // Save duration for current step
      if (prev.step === 1) updates.personalDuration = duration;
      if (prev.step === 2) updates.technicalDuration = duration;
      if (prev.step === 3) updates.psikotesDuration = duration;
      
      return { ...prev, ...updates };
    });
  };

  const handleSubmit = async () => {
    setState(prev => ({ ...prev, isSubmitting: true }));

    try {
      // Calculate final psikotes duration
      const now = Date.now();
      const psikotesDuration = Math.floor((now - state.stepStartTime) / 1000);
      const totalDuration = Math.floor((now - state.startTime) / 1000);

      // Timer data
      const timer: TimerData = {
        startTime: state.startTime,
        personalDuration: state.personalDuration,
        technicalDuration: state.technicalDuration,
        psikotesDuration: psikotesDuration,
        totalDuration: totalDuration
      };

      // Convert CV to base64
      let cvBase64 = '';
      let cvMimeType = '';
      if (state.personal.cvFile) {
        cvBase64 = await fileToBase64(state.personal.cvFile);
        cvMimeType = state.personal.cvFile.type;
      }

      // Score tests
      const technicalScores = scoreTechnical(state.technical);
      const psikotesScores = scorePsikotes(state.psikotes);
      const overallScore = calculateOverallScore(technicalScores.total, psikotesScores.total);
      const status = overallScore >= 8 ? 'LULUS' : 'TIDAK LULUS';

      // Create result
      const result: FinalResult = {
        id: generateId(),
        timestamp: new Date().toLocaleString('id-ID', { 
          dateStyle: 'full', 
          timeStyle: 'short' 
        }),
        personal: state.personal,
        technical: technicalScores,
        psikotes: psikotesScores,
        overallScore,
        status,
        cvUrl: cvBase64,
        timer
      };

      // Save to database
      const applicantData = {
        id: result.id,
        timestamp: result.timestamp,
        nama: state.personal.nama,
        email: state.personal.email,
        whatsapp: state.personal.whatsapp,
        cvUrl: cvBase64,
        cvFileName: state.personal.cvFileName,
        cvBase64: cvBase64,
        cvMimeType: cvMimeType,
        technicalScore: technicalScores.total,
        technicalDetail: {
          phpLaravel: technicalScores.phpLaravel,
          mysqlGit: technicalScores.mysqlGit,
          problemSolving: technicalScores.problemSolving,
          aiAutomation: technicalScores.aiAutomation
        },
        technicalAnswers: state.technical,
        technicalScoreDetails: technicalScores.details,
        psikotesScore: psikotesScores.total,
        psikotesDetail: {
          multiProject: psikotesScores.multiProject,
          learning: psikotesScores.learning,
          initiative: psikotesScores.initiative,
          team: psikotesScores.team,
          change: psikotesScores.change
        },
        psikotesAnswers: state.psikotes,
        psikotesScoreDetails: psikotesScores.details,
        overallScore,
        status,
        timer
      };

      await saveApplicant(applicantData);
      sendNotification(result).catch(console.error);

      setState(prev => ({ 
        ...prev, 
        step: 4, 
        result, 
        isSubmitting: false,
        psikotesDuration: psikotesDuration
      }));

    } catch (error) {
      console.error('Submit error:', error);
      alert('Terjadi kesalahan. Silakan coba lagi.');
      setState(prev => ({ ...prev, isSubmitting: false }));
    }
  };

  return (
    <main className="min-h-screen py-8 px-4">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          <span className="text-blue-400">RAY</span>CORP
        </h1>
        <p className="text-gray-400">IT Staff Developer Recruitment</p>
      </div>

      {/* Landing Page */}
      {state.step === 0 && (
        <LandingPage onStart={handleStart} />
      )}

      {/* Step Indicator */}
      {state.step >= 1 && state.step < 4 && (
        <StepIndicator currentStep={state.step} totalSteps={4} />
      )}

      {/* Form Steps */}
      {state.step === 1 && (
        <Step1Personal
          data={state.personal}
          onUpdate={(personal) => setState(prev => ({ ...prev, personal }))}
          onNext={() => handleNextStep(2)}
        />
      )}

      {state.step === 2 && (
        <Step2Technical
          data={state.technical}
          onUpdate={(technical) => setState(prev => ({ ...prev, technical }))}
          onNext={() => handleNextStep(3)}
          onBack={() => handleNextStep(1)}
        />
      )}

      {state.step === 3 && (
        <Step3Psikotes
          data={state.psikotes}
          onUpdate={(psikotes) => setState(prev => ({ ...prev, psikotes }))}
          onSubmit={handleSubmit}
          onBack={() => handleNextStep(2)}
          isSubmitting={state.isSubmitting}
        />
      )}

      {state.step === 4 && state.result && (
        <Step4Result result={state.result} />
      )}

      {/* Footer */}
      <footer className="text-center mt-12 text-gray-500 text-sm">
        <p>© 2026 RayCorp - Rayandra Corporation</p>
        <p className="mt-1">Building Tomorrow's Digital Ecosystem</p>
      </footer>
    </main>
  );
}
