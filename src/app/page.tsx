'use client';

import { useState } from 'react';
import StepIndicator from '@/components/StepIndicator';
import Step1Personal from '@/components/Step1Personal';
import Step2Technical from '@/components/Step2Technical';
import Step3Psikotes from '@/components/Step3Psikotes';
import Step4Result from '@/components/Step4Result';
import { FormState, FinalResult } from '@/lib/types';
import { scoreTechnicalWithAI, scorePsikotes, generateId } from '@/lib/scoring';
import { uploadCV, saveApplicant, sendNotification } from '@/lib/api';

const initialState: FormState = {
  step: 1,
  personal: { nama: '', email: '', whatsapp: '', cvFile: null, cvFileName: '' },
  technical: {
    soal1a: '', soal1b: '', soal2a: '', soal2b: '',
    soal3a: '', soal3b: '', soal4a: '', soal4b: '',
    soal5a: '', soal5b: '', soal5c: ''
  },
  psikotes: {
    skenario1: '', skenario2: '', skenario3: '',
    b1: 0, b2: 0, b3: 0, b4: 0, b5: 0, b6: 0, b7: 0, b8: 0, b9: 0, b10: 0,
    c1: '', c2: '', d1: '', d2: ''
  },
  isSubmitting: false,
  result: null
};

export default function Home() {
  const [state, setState] = useState<FormState>(initialState);

  const handleSubmit = async () => {
    setState(prev => ({ ...prev, isSubmitting: true }));

    try {
      // 1. Upload CV (compressed)
      let cvUrl = '';
      if (state.personal.cvFile) {
        cvUrl = await uploadCV(state.personal.cvFile);
      }

      // 2. Score technical test with AI
      const technicalScores = await scoreTechnicalWithAI(state.technical);

      // 3. Score psikotes (rule-based)
      const psikotesScores = scorePsikotes(state.psikotes);

      // 4. Calculate overall score (weighted average)
      const overallScore = Math.round(((technicalScores.total * 0.6) + (psikotesScores.total * 0.4)) * 10) / 10;
      const status = overallScore >= 8 ? 'LULUS' : 'TIDAK LULUS';

      // 5. Create result object
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
        cvUrl
      };

      // 6. Save to database (Vercel KV + localStorage backup)
      await saveApplicant(result);

      // 7. Send notification to n8n for email (background)
      sendNotification(result).catch(console.error);

      // 8. Show result
      setState(prev => ({ ...prev, step: 4, result, isSubmitting: false }));

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

      {/* Step Indicator */}
      {state.step < 4 && <StepIndicator currentStep={state.step} totalSteps={4} />}

      {/* Form Steps */}
      {state.step === 1 && (
        <Step1Personal
          data={state.personal}
          onUpdate={(personal) => setState(prev => ({ ...prev, personal }))}
          onNext={() => setState(prev => ({ ...prev, step: 2 }))}
        />
      )}

      {state.step === 2 && (
        <Step2Technical
          data={state.technical}
          onUpdate={(technical) => setState(prev => ({ ...prev, technical }))}
          onNext={() => setState(prev => ({ ...prev, step: 3 }))}
          onBack={() => setState(prev => ({ ...prev, step: 1 }))}
        />
      )}

      {state.step === 3 && (
        <Step3Psikotes
          data={state.psikotes}
          onUpdate={(psikotes) => setState(prev => ({ ...prev, psikotes }))}
          onSubmit={handleSubmit}
          onBack={() => setState(prev => ({ ...prev, step: 2 }))}
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
