import React from 'react';
import { CheckCircle2, Download } from 'lucide-react';

interface DownloadSuccessPopupProps {
  isVisible: boolean;
}

export const DownloadSuccessPopup: React.FC<DownloadSuccessPopupProps> = ({ isVisible }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed top-20 sm:top-24 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-4 duration-300 pointer-events-none">
      <div className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-[#24162F] text-[#FFF8ED] border border-[#3C8D87] shadow-[0_15px_35px_rgba(36,22,47,0.3)]">
        <div className="w-7 h-7 rounded-lg bg-[#3C8D87] text-white flex items-center justify-center flex-shrink-0">
          <CheckCircle2 className="w-4 h-4" />
        </div>
        <div className="text-left">
          <span className="text-xs font-bold font-heading block text-white">
            Document Download Initiated
          </span>
          <span className="text-[10px] text-[#A8D5C2] font-mono block">
            Pristine file delivered to your device
          </span>
        </div>
        <Download className="w-4 h-4 text-[#A8D5C2] animate-bounce ml-2" />
      </div>
    </div>
  );
};
