import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { UploadCloud, Sliders, Cpu, Eye, Download, Check } from 'lucide-react';

export const ProgressStepper: React.FC = () => {
  const location = useLocation();

  const steps = [
    { id: 'upload', label: 'Upload', path: '/upload', icon: UploadCloud },
    { id: 'options', label: 'Options', path: '/choose-options', icon: Sliders },
    { id: 'processing', label: 'Restore', path: '/processing', icon: Cpu },
    { id: 'preview', label: 'Preview', path: '/preview', icon: Eye },
    { id: 'download', label: 'Export', path: '/download-options', icon: Download },
  ];

  const getStepIndex = (pathname: string) => {
    if (pathname.includes('/upload')) return 0;
    if (pathname.includes('/choose-options')) return 1;
    if (pathname.includes('/processing')) return 2;
    if (pathname.includes('/preview')) return 3;
    if (pathname.includes('/download')) return 4;
    return 0;
  };

  const currentStep = getStepIndex(location.pathname);

  return (
    <div className="w-full max-w-2xl mx-auto mb-4 sm:mb-6 px-2">
      <div className="flex items-center justify-between relative">
        {/* Background Track Line */}
        <div className="absolute top-1/2 left-0 right-0 h-0.5 -translate-y-1/2 bg-[#EADCC8] z-0" />

        {/* Active Progress Line */}
        <div
          className="absolute top-1/2 left-0 h-0.5 -translate-y-1/2 bg-gradient-to-r from-[#6B315E] to-[#3C8D87] z-0 transition-all duration-500"
          style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
        />

        {/* Steps */}
        {steps.map((step, idx) => {
          const Icon = step.icon;
          const isCompleted = idx < currentStep;
          const isCurrent = idx === currentStep;

          return (
            <div key={step.id} className="relative z-10 flex flex-col items-center">
              <div
                className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center transition-all duration-300 ${
                  isCompleted
                    ? 'bg-[#3C8D87] text-white shadow-xs'
                    : isCurrent
                    ? 'bg-[#6B315E] text-white shadow-md shadow-[#6B315E]/30 scale-110'
                    : 'bg-[#FFF8ED] text-[#978D91] border-2 border-[#EADCC8]'
                }`}
              >
                {isCompleted ? (
                  <Check className="w-4 h-4 stroke-[3]" />
                ) : (
                  <Icon className="w-4 h-4" />
                )}
              </div>
              <span
                className={`text-[10px] sm:text-xs font-bold mt-1.5 transition-colors font-mono uppercase tracking-wider ${
                  isCurrent
                    ? 'text-[#6B315E]'
                    : isCompleted
                    ? 'text-[#3C8D87]'
                    : 'text-[#978D91]'
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
