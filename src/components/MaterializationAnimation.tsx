import React from 'react';
import { DownloadFormat } from '../types';
import { FileText, Cpu, Sparkles, CheckCircle2 } from 'lucide-react';

interface MaterializationAnimationProps {
  format: DownloadFormat;
  progress: number;
  stageName: string;
}

export const MaterializationAnimation: React.FC<MaterializationAnimationProps> = ({
  format,
  progress,
  stageName,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-6 w-full max-w-md mx-auto select-none">
      {/* 3D Pulsing Chamber Visual */}
      <div className="relative w-44 h-44 mb-8 flex items-center justify-center">
        {/* Outer Glow Halo */}
        <div
          className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#6B315E]/20 to-[#3C8D87]/30 blur-2xl animate-pulse"
          style={{ transform: `scale(${0.9 + (progress / 100) * 0.3})` }}
        />

        {/* Orbiting Ring */}
        <div className="absolute inset-2 rounded-full border-2 border-dashed border-[#3C8D87]/40 animate-spin" style={{ animationDuration: '8s' }} />
        <div className="absolute inset-6 rounded-full border border-[#6B315E]/30 animate-spin" style={{ animationDuration: '5s', animationDirection: 'reverse' }} />

        {/* Center Card */}
        <div className="relative z-10 w-24 h-32 rounded-2xl bg-[#FFF8ED] border-2 border-[#3C8D87] shadow-[0_15px_35px_rgba(60,141,135,0.25)] flex flex-col items-center justify-between p-3.5 transition-transform duration-500">
          <div className="flex items-center justify-between w-full">
            <Sparkles className="w-3.5 h-3.5 text-[#3C8D87]" />
            <span className="text-[9px] font-mono font-bold text-[#6B315E]">
              .{format.toUpperCase()}
            </span>
          </div>

          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#3C8D87] to-[#A8D5C2] text-white flex items-center justify-center shadow-xs">
            <FileText className="w-5 h-5" />
          </div>

          <div className="w-full space-y-1">
            <div className="h-1 w-full bg-[#EADCC8] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#3C8D87] transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Floating Particles */}
        <div className="absolute -top-1 right-2 w-3 h-3 rounded-full bg-[#3C8D87]/60 animate-ping" />
        <div className="absolute -bottom-2 left-3 w-2 h-2 rounded-full bg-[#6B315E]/60 animate-ping" />
      </div>

      {/* Progress Metric */}
      <div className="flex items-center gap-2 mb-2">
        <Cpu className="w-4 h-4 text-[#3C8D87] animate-spin" style={{ animationDuration: '3s' }} />
        <span className="font-heading font-extrabold text-2xl text-[#24162F]">
          {Math.min(100, Math.round(progress))}%
        </span>
      </div>

      {/* Dynamic Stage Text */}
      <p className="text-xs font-mono text-[#6F6670] tracking-wide max-w-xs text-center min-h-[32px] flex items-center justify-center">
        {stageName}
      </p>

      {/* Linear Bar */}
      <div className="w-full bg-[#EADCC8] h-2 rounded-full overflow-hidden mt-4">
        <div
          className="h-full bg-gradient-to-r from-[#6B315E] via-[#3C8D87] to-[#A8D5C2] transition-all duration-300 rounded-full"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};
