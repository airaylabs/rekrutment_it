'use client';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

const stepLabels = ['Data Diri', 'Technical Test', 'Psikotes', 'Hasil'];

export default function StepIndicator({ currentStep, totalSteps }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-center mb-8">
      {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step, index) => (
        <div key={step} className="flex items-center">
          <div className="flex flex-col items-center">
            <div
              className={`step-indicator ${
                step < currentStep ? 'completed' : step === currentStep ? 'active' : 'pending'
              }`}
            >
              {step < currentStep ? '✓' : step}
            </div>
            <span className={`text-xs mt-2 ${step === currentStep ? 'text-blue-400' : 'text-gray-500'}`}>
              {stepLabels[index]}
            </span>
          </div>
          {index < totalSteps - 1 && (
            <div
              className={`w-16 h-1 mx-2 rounded ${
                step < currentStep ? 'bg-green-500' : 'bg-gray-600'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}
