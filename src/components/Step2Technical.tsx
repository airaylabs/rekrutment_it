'use client';

import { TechnicalAnswers } from '@/lib/types';
import { technicalQuestions, technicalQuestions2 } from '@/lib/questions';
import { useState } from 'react';

interface Question {
  id: string;
  type: 'multiple';
  label: string;
  options: { value: string; label: string }[];
  correctAnswer: string;
}

interface QuestionGroup {
  id: string;
  title: string;
  category: string;
  weight: number;
  description: string;
  questions: Question[];
}

interface Step2Props {
  data: TechnicalAnswers;
  onUpdate: (data: TechnicalAnswers) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function Step2Technical({ data, onUpdate, onNext, onBack }: Step2Props) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const allQuestions: QuestionGroup[] = [...technicalQuestions, ...technicalQuestions2] as QuestionGroup[];
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

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      'php_laravel': 'PHP/Laravel (Bobot Tertinggi)',
      'mysql_git': 'MySQL & Git',
      'problem_solving': 'Problem Solving',
      'ai_automation': 'AI & Automation (Nilai Plus)'
    };
    return labels[category] || category;
  };

  const renderQuestion = (q: Question) => {
    return (
      <div key={q.id} className="mb-6">
        <label className="block text-sm font-medium text-gray-300 mb-3">{q.label}</label>
        <div className="space-y-2">
          {q.options.map((option) => (
            <label
              key={option.value}
              className={`flex items-start p-3 rounded-lg cursor-pointer transition-all border ${
                data[q.id as keyof TechnicalAnswers] === option.value
                  ? 'bg-blue-500/20 border-blue-500 text-white'
                  : 'bg-slate-800/50 border-slate-700 text-gray-300 hover:border-slate-600'
              }`}
            >
              <input
                type="radio"
                name={q.id}
                value={option.value}
                checked={data[q.id as keyof TechnicalAnswers] === option.value}
                onChange={() => handleChange(q.id, option.value)}
                className="mr-3 mt-1 accent-blue-500"
              />
              <span>
                <span className="font-medium mr-2">{option.value}.</span>
                {option.label}
              </span>
            </label>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="card p-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-4">
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

      <div className="mb-4">
        <span className="inline-block px-3 py-1 bg-slate-700 rounded-full text-sm text-gray-300">
          {getCategoryLabel(question.category)}
        </span>
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

      <div className="space-y-2">
        {question.questions.map((q) => renderQuestion(q as Question))}
      </div>

      <div className="mt-8 flex justify-between">
        <button className="btn-secondary" onClick={handlePrevQuestion}>
          {currentQuestion === 0 ? 'Kembali' : 'Soal Sebelumnya'}
        </button>
        <button 
          className="btn-primary" 
          onClick={handleNextQuestion}
          disabled={!isCurrentComplete()}
        >
          {currentQuestion === allQuestions.length - 1 ? 'Lanjut ke Psikotes' : 'Soal Berikutnya'}
        </button>
      </div>
    </div>
  );
}
