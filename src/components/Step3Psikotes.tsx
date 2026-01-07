'use client';

import { PsikotesAnswers } from '@/lib/types';
import { psikotesSkenario, psikotesStatements, psikotesC2Options } from '@/lib/questions';
import { useState } from 'react';

interface Step3Props {
  data: PsikotesAnswers;
  onUpdate: (data: PsikotesAnswers) => void;
  onSubmit: () => void;
  onBack: () => void;
  isSubmitting: boolean;
}

export default function Step3Psikotes({ data, onUpdate, onSubmit, onBack, isSubmitting }: Step3Props) {
  const [section, setSection] = useState<'skenario' | 'statements' | 'open'>('skenario');

  const handleSkenarioChange = (id: string, value: string) => {
    onUpdate({ ...data, [id]: value });
  };

  const handleStatementChange = (id: string, value: number) => {
    onUpdate({ ...data, [id]: value });
  };

  const isSkenarioComplete = () => {
    return data.skenario1 && data.skenario2 && data.skenario3;
  };

  const isStatementsComplete = () => {
    return data.b1 > 0 && data.b2 > 0 && data.b3 > 0 && data.b4 > 0 && data.b5 > 0 &&
           data.b6 > 0 && data.b7 > 0 && data.b8 > 0 && data.b9 > 0 && data.b10 > 0;
  };

  const isOpenComplete = () => {
    return data.c2 && data.d1.trim().length > 10 && data.d2.trim().length > 10;
  };

  const renderSkenario = () => (
    <div className="space-y-8">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-white">Bagian A: Situational Judgment</h3>
        <p className="text-gray-400">Pilih respons yang paling mendekati apa yang akan Anda lakukan</p>
      </div>
      
      {psikotesSkenario.map((skenario) => (
        <div key={skenario.id} className="bg-slate-900/50 rounded-lg p-6">
          <h4 className="text-lg font-semibold text-blue-400 mb-2">{skenario.title}</h4>
          <p className="text-gray-300 mb-4">{skenario.description}</p>
          <div className="space-y-2">
            {skenario.options.map((option) => (
              <label
                key={option.value}
                className={`radio-option ${data[skenario.id as keyof PsikotesAnswers] === option.value ? 'selected' : ''}`}
              >
                <input
                  type="radio"
                  name={skenario.id}
                  value={option.value}
                  checked={data[skenario.id as keyof PsikotesAnswers] === option.value}
                  onChange={() => handleSkenarioChange(skenario.id, option.value)}
                  className="mr-3"
                />
                <span className="text-gray-200">{option.label}</span>
              </label>
            ))}
          </div>
        </div>
      ))}
      
      <div className="flex justify-between">
        <button className="btn-secondary" onClick={onBack}>← Kembali</button>
        <button 
          className="btn-primary" 
          onClick={() => setSection('statements')}
          disabled={!isSkenarioComplete()}
        >
          Lanjut →
        </button>
      </div>
    </div>
  );

  const renderStatements = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-white">Bagian B: Self-Assessment</h3>
        <p className="text-gray-400">Berikan rating 1-5 (1=Sangat Tidak Setuju, 5=Sangat Setuju)</p>
      </div>

      {psikotesStatements.map((statement) => (
        <div key={statement.id} className="bg-slate-900/50 rounded-lg p-4">
          <p className="text-gray-200 mb-3">{statement.text}</p>
          <div className="flex justify-center gap-4">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                onClick={() => handleStatementChange(statement.id, value)}
                className={`w-12 h-12 rounded-full font-bold transition-all ${
                  data[statement.id as keyof PsikotesAnswers] === value
                    ? 'bg-blue-500 text-white scale-110'
                    : 'bg-slate-700 text-gray-400 hover:bg-slate-600'
                }`}
              >
                {value}
              </button>
            ))}
          </div>
        </div>
      ))}

      <div className="flex justify-between">
        <button className="btn-secondary" onClick={() => setSection('skenario')}>← Kembali</button>
        <button 
          className="btn-primary" 
          onClick={() => setSection('open')}
          disabled={!isStatementsComplete()}
        >
          Lanjut →
        </button>
      </div>
    </div>
  );

  const renderOpen = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-white">Bagian C & D: Preferensi & Refleksi</h3>
      </div>

      <div className="bg-slate-900/50 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-blue-400 mb-3">Ketika menghadapi masalah teknis sulit, saya biasanya:</h4>
        <div className="space-y-2">
          {psikotesC2Options.map((option) => (
            <label
              key={option.value}
              className={`radio-option ${data.c2 === option.value ? 'selected' : ''}`}
            >
              <input
                type="radio"
                name="c2"
                value={option.value}
                checked={data.c2 === option.value}
                onChange={() => onUpdate({ ...data, c2: option.value })}
                className="mr-3"
              />
              <span className="text-gray-200">{option.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Ceritakan pengalaman ketika Anda harus belajar sesuatu yang baru dalam waktu singkat
        </label>
        <textarea
          className="form-textarea h-24"
          placeholder="Tulis pengalaman Anda..."
          value={data.d1}
          onChange={(e) => onUpdate({ ...data, d1: e.target.value })}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Apa yang membuat Anda tertarik melamar di RayCorp?
        </label>
        <textarea
          className="form-textarea h-24"
          placeholder="Tulis alasan Anda..."
          value={data.d2}
          onChange={(e) => onUpdate({ ...data, d2: e.target.value })}
        />
      </div>

      <div className="flex justify-between">
        <button className="btn-secondary" onClick={() => setSection('statements')}>← Kembali</button>
        <button 
          className="btn-primary" 
          onClick={onSubmit}
          disabled={!isOpenComplete() || isSubmitting}
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
              Memproses...
            </span>
          ) : (
            'Submit & Lihat Hasil 🚀'
          )}
        </button>
      </div>
    </div>
  );

  return (
    <div className="card p-8 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Psikotes</h2>
        <div className="flex gap-2">
          {['skenario', 'statements', 'open'].map((s, i) => (
            <div
              key={s}
              className={`w-3 h-3 rounded-full ${
                s === section ? 'bg-blue-500' : 
                (s === 'skenario' && section !== 'skenario') || 
                (s === 'statements' && section === 'open') ? 'bg-green-500' : 'bg-gray-600'
              }`}
            />
          ))}
        </div>
      </div>

      {section === 'skenario' && renderSkenario()}
      {section === 'statements' && renderStatements()}
      {section === 'open' && renderOpen()}
    </div>
  );
}
