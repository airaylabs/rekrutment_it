'use client';

import { PersonalData } from '@/lib/types';
import { useState } from 'react';
import { compressImage, formatFileSize, isImageFile } from '@/lib/compress';

interface Step1Props {
  data: PersonalData;
  onUpdate: (data: PersonalData) => void;
  onNext: () => void;
}

const ALLOWED_TYPES = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg', 
  'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

export default function Step1Personal({ data, onUpdate, onNext }: Step1Props) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [dragActive, setDragActive] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);
  const [fileInfo, setFileInfo] = useState<{ original: number; compressed: number } | null>(null);

  const handleFileChange = async (file: File | null) => {
    if (!file) return;
    
    if (!ALLOWED_TYPES.includes(file.type)) {
      setErrors(prev => ({ ...prev, cv: 'Format file harus PDF, JPG, PNG, atau DOC/DOCX' }));
      return;
    }
    
    if (file.size > MAX_SIZE) {
      setErrors(prev => ({ ...prev, cv: 'Ukuran file maksimal 5MB' }));
      return;
    }
    
    setErrors(prev => ({ ...prev, cv: '' }));
    
    // Compress if image
    if (isImageFile(file)) {
      setIsCompressing(true);
      try {
        const originalSize = file.size;
        const compressedFile = await compressImage(file);
        setFileInfo({ original: originalSize, compressed: compressedFile.size });
        onUpdate({ ...data, cvFile: compressedFile, cvFileName: file.name });
      } catch (error) {
        console.error('Compression error:', error);
        onUpdate({ ...data, cvFile: file, cvFileName: file.name });
      }
      setIsCompressing(false);
    } else {
      setFileInfo(null);
      onUpdate({ ...data, cvFile: file, cvFileName: file.name });
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!data.nama.trim()) newErrors.nama = 'Nama wajib diisi';
    if (!data.email.trim()) newErrors.email = 'Email wajib diisi';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) newErrors.email = 'Format email tidak valid';
    if (!data.whatsapp.trim()) newErrors.whatsapp = 'WhatsApp wajib diisi';
    if (!data.cvFile) newErrors.cv = 'CV wajib diupload';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validate()) onNext();
  };

  return (
    <div className="card p-8 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-white mb-2">Data Diri & Upload CV</h2>
      <p className="text-gray-400 mb-6">Lengkapi data diri Anda untuk melanjutkan ke test</p>

      <div className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Nama Lengkap *</label>
          <input
            type="text"
            className="form-input"
            placeholder="Masukkan nama lengkap"
            value={data.nama}
            onChange={(e) => onUpdate({ ...data, nama: e.target.value })}
          />
          {errors.nama && <p className="text-red-400 text-sm mt-1">{errors.nama}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Email *</label>
          <input
            type="email"
            className="form-input"
            placeholder="email@example.com"
            value={data.email}
            onChange={(e) => onUpdate({ ...data, email: e.target.value })}
          />
          {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">No. WhatsApp *</label>
          <input
            type="tel"
            className="form-input"
            placeholder="08xxxxxxxxxx"
            value={data.whatsapp}
            onChange={(e) => onUpdate({ ...data, whatsapp: e.target.value })}
          />
          {errors.whatsapp && <p className="text-red-400 text-sm mt-1">{errors.whatsapp}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Upload CV *</label>
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-all cursor-pointer
              ${dragActive ? 'border-blue-500 bg-blue-500/10' : 'border-slate-600 hover:border-slate-500'}
              ${data.cvFile ? 'border-green-500 bg-green-500/10' : ''}
              ${isCompressing ? 'opacity-50 pointer-events-none' : ''}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => !isCompressing && document.getElementById('cv-input')?.click()}
          >
            <input
              id="cv-input"
              type="file"
              className="hidden"
              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
              onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
            />
            {isCompressing ? (
              <div className="text-blue-400">
                <svg className="animate-spin h-8 w-8 mx-auto mb-2" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
                <p>Mengompresi gambar...</p>
              </div>
            ) : data.cvFile ? (
              <div className="text-green-400">
                <span className="text-3xl">✓</span>
                <p className="mt-2 font-medium">{data.cvFileName}</p>
                {fileInfo && (
                  <p className="text-xs text-gray-400 mt-1">
                    {formatFileSize(fileInfo.original)} → {formatFileSize(fileInfo.compressed)}
                    {fileInfo.compressed < fileInfo.original && (
                      <span className="text-green-400 ml-1">
                        (hemat {Math.round((1 - fileInfo.compressed / fileInfo.original) * 100)}%)
                      </span>
                    )}
                  </p>
                )}
                <p className="text-sm text-gray-400 mt-1">Klik untuk ganti file</p>
              </div>
            ) : (
              <div className="text-gray-400">
                <span className="text-3xl">📄</span>
                <p className="mt-2">Drag & drop atau klik untuk upload</p>
                <p className="text-sm">PDF, JPG, PNG, DOC/DOCX (max 5MB)</p>
                <p className="text-xs text-gray-500 mt-1">Gambar akan otomatis dikompresi</p>
              </div>
            )}
          </div>
          {errors.cv && <p className="text-red-400 text-sm mt-1">{errors.cv}</p>}
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <button className="btn-primary" onClick={handleNext} disabled={isCompressing}>
          Lanjut ke Technical Test →
        </button>
      </div>
    </div>
  );
}
