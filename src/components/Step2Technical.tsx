'use client';

import { TechnicalAnswers } from '@/lib/types';
import { technicalQuestions, technicalQuestions2 } from '@/lib/questions';
import { useState } from 'react';

interface Step2Props {
  data: TechnicalAnswers;
  onUpdate: (data: TechnicalAnswers) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function Step2Technical({ data, onUpdate, onNext, onBack }: Step2Props) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const allQuestions = [...technicalQuestions, ...technicalQuestions2];
  const question = allQuestions[currentQuestion];

  const handleChange = (id: string, value: string) => {
    onUpdate({ ...data, [id]: value });
  };

  const isCurrentComplete = () => {
    return question.questions.every(q => {
      const answer = data[q.id as keyof TechnicalAnswers];
      return answer && answer.toString().trim().length > 0;
    });
  };

  const handleNextQuestion = () => {
    if (currentQuestion < allQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      onNext();
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    } else {
      onBack();
    }
  };

  return (
    <div className="card p-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">Technical Test</h2>
          <p className="text-gray-400">Soal {currentQuestion + 1} dari {allQuestions.length}</p>
        </div>
        <div className="flex gap-1">
          {allQuestions.map((_, i) => (
            <div
              key={i}
              className={`w-3 h-3 rounded-full ${
                i < currentQuestion ? 'bg-green-500' : i === currentQuestion ? 'bg-blue-500' : 'bg-gray-600'
              }`}
            />
          ))}
        </div>
      </div>

      <div className="bg-slate-900/50 rounded-lg p-6 mb-6">
        <h3 className="text-xl font-semibold text-blue-400 mb-3">{question.title}</h3>
        <div className="text-gray-300 whitespace-pre-wrap text-sm leading-relaxed">
          {question.description.split('```').map((part, i) => 
            i % 2 === 1 ? (
              <pre key={i} className="bg-slate-800 p-4 rounded-lg my-3 overflow-x-auto text-green-400 text-xs">
                <code>{part.replace(/^(php|sql)\n/, '')}</code>
              </pre>
            ) : (
              <span key={i}>{part}</span>
            )
          )}
        </div>
      </div>

      <div className="space-y-5">
        {question.questions.map((q) => (
          <div key={q.id}>
            <label className="block text-sm font-medium text-gray-300 mb-2">{q.label}</label>
            <textarea
              className="form-textarea h-32"
              placeholder="Tulis jawaban Anda di sini..."
              value={data[q.id as keyof TechnicalAnswers] || ''}
              onChange={(e) => handleChange(q.id, e.target.value)}
            />
          </div>
        ))}
      </div>

      <div className="mt-8 flex justify-between">
        <button className="btn-secondary" onClick={handlePrevQuestion}>
          ← {currentQuestion === 0 ? 'Kembali' : 'Soal Sebelumnya'}
        </button>
        <button 
          className="btn-primary" 
          onClick={handleNextQuestion}
          disabled={!isCurrentComplete()}
        >
          {currentQuestion === allQuestions.length - 1 ? 'Lanjut ke Psikotes →' : 'Soal Berikutnya →'}
        </button>
      </div>
    </div>
  );
}
