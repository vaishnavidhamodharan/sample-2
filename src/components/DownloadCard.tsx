import React from 'react';
import { DownloadFormat } from '../types';
import { FileText, FileCode, CheckCircle2 } from 'lucide-react';

interface DownloadCardProps {
  selectedFormat: DownloadFormat;
  onSelectFormat: (format: DownloadFormat) => void;
}

export const DownloadCard: React.FC<DownloadCardProps> = ({
  selectedFormat,
  onSelectFormat,
}) => {
  const formats: {
    id: DownloadFormat;
    label: string;
    ext: string;
    description: string;
    tag: string;
    icon: React.ComponentType<{ className?: string }>;
  }[] = [
    {
      id: 'pdf',
      label: 'Adobe PDF Document',
      ext: '.pdf',
      description: 'Preserves typography, line spacing, margins, and digital signatures.',
      tag: 'Recommended',
      icon: FileText,
    },
    {
      id: 'docx',
      label: 'Microsoft Word Document',
      ext: '.docx',
      description: 'Fully editable rich document format compatible with Word & Google Docs.',
      tag: 'Editable',
      icon: FileText,
    },
    {
      id: 'txt',
      label: 'Clean UTF-8 Text',
      ext: '.txt',
      description: 'Lightweight, unformatted plain text ideal for LLMs, codebases, and parsing.',
      tag: 'Universal',
      icon: FileCode,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
      {formats.map((fmt) => {
        const Icon = fmt.icon;
        const isSelected = selectedFormat === fmt.id;

        return (
          <div
            key={fmt.id}
            onClick={() => onSelectFormat(fmt.id)}
            className={`p-5 rounded-2xl border-2 transition-all duration-300 cursor-pointer flex flex-col justify-between select-none relative ${
              isSelected
                ? 'bg-[#FFF8ED] border-[#3C8D87] shadow-[0_10px_30px_rgba(60,141,135,0.15)] scale-[1.02]'
                : 'bg-[#FFF8ED]/70 border-[#EADCC8] hover:border-[#6B315E]/30 hover:bg-[#FFF8ED]'
            }`}
          >
            {/* Top Indicator */}
            <div className="flex items-start justify-between mb-4">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                  isSelected
                    ? 'bg-[#3C8D87] text-white'
                    : 'bg-[#EADCC8]/60 text-[#6F6670]'
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-[#EADCC8]/50 text-[#6F6670] uppercase">
                  {fmt.tag}
                </span>
                {isSelected && (
                  <CheckCircle2 className="w-5 h-5 text-[#3C8D87] fill-[#3C8D87]/15" />
                )}
              </div>
            </div>

            {/* Title & Description */}
            <div>
              <div className="flex items-baseline gap-1.5 mb-1">
                <h4 className="font-heading font-extrabold text-base text-[#2C2830]">
                  {fmt.label}
                </h4>
                <span className="font-mono text-xs font-bold text-[#3C8D87]">
                  {fmt.ext}
                </span>
              </div>
              <p className="text-xs text-[#6F6670] leading-relaxed">
                {fmt.description}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
