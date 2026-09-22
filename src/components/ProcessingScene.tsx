import React from 'react';
import { DocumentCore } from './DocumentCore';
import { AIPipeline } from './AIPipeline';
import { Sparkles, Cpu, Layers } from 'lucide-react';

interface ProcessingSceneProps {
  progress: number;
  stageName: string;
  fileName?: string;
}

export const ProcessingScene: React.FC<ProcessingSceneProps> = ({
  progress,
  stageName,
  fileName = 'document.pdf',
}) => {
  // Laser scan line calculation based on progress
  const scanLinePercent = progress <= 100 ? (progress % 100) : 50;

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-4xl mx-auto select-none preserve-3d">
      {/* 3D Visual Chamber Container */}
      <div className="relative w-full rounded-3xl bg-[#FFF8ED] border border-[#6B315E]/20 shadow-[0_20px_60px_-15px_rgba(36,22,47,0.15)] p-6 sm:p-10 flex flex-col items-center overflow-hidden preserve-3d">
        {/* Top Header */}
        <div className="w-full flex items-center justify-between pb-4 mb-4 border-b border-[#EADCC8]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#24162F] text-white flex items-center justify-center shadow-xs">
              <Cpu className="w-5 h-5 text-[#A8D5C2]" />
            </div>
            <div>
              <h3 className="font-heading font-extrabold text-sm sm:text-base text-[#24162F] truncate max-w-[220px] sm:max-w-md">
                {fileName}
              </h3>
              <span className="text-[10px] font-mono text-[#3C8D87] font-semibold">
                NEURAL OPTICAL RESTORATION IN PROGRESS
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-[#EADCC8]/50 px-3 py-1.5 rounded-xl border border-[#6B315E]/10">
            <Layers className="w-3.5 h-3.5 text-[#6B315E]" />
            <span className="font-mono text-xs font-bold text-[#6B315E]">
              {Math.min(100, Math.round(progress))}%
            </span>
          </div>
        </div>

        {/* 3D Central Document Core with Active Scan Laser */}
        <div className="relative my-2 py-4 flex items-center justify-center scale-90 sm:scale-100">
          <DocumentCore
            title={fileName}
            separationFactor={Math.min(1, progress / 70)}
            activeScanLinePercent={scanLinePercent}
            interactiveMouse={true}
          />

          {/* Radial Scanner Pulse Ring */}
          <div
            className="absolute inset-0 rounded-full border border-[#3C8D87]/30 pointer-events-none animate-ping"
            style={{ animationDuration: '3s' }}
          />
        </div>

        {/* Dynamic Status Display */}
        <div className="w-full max-w-xl text-center space-y-3 mt-4">
          <div className="flex items-center justify-center gap-2 text-xs font-mono text-[#3C8D87] font-bold tracking-wider uppercase">
            <Sparkles className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '4s' }} />
            <span>{stageName}</span>
          </div>

          {/* Smooth Progress Bar */}
          <div className="w-full bg-[#EADCC8] h-2.5 rounded-full overflow-hidden p-0.5 border border-[#6B315E]/10">
            <div
              className="h-full bg-gradient-to-r from-[#6B315E] via-[#3C8D87] to-[#A8D5C2] rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Active AI Pipeline Stage Indicators */}
      <div className="w-full">
        <AIPipeline />
      </div>
    </div>
  );
};
