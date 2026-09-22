import React, { useState, useRef } from 'react';
import { useMouseParallax } from '../hooks/useMouseParallax';
import { FileText, MoveHorizontal, Check } from 'lucide-react';

interface TimeSplitPreviewProps {
  originalText?: string;
  cleanedText?: string;
  fileName?: string;
}

export const TimeSplitPreview: React.FC<TimeSplitPreviewProps> = ({
  originalText = '',
  cleanedText = '',
  fileName = 'document.pdf',
}) => {
  const [splitPercent, setSplitPercent] = useState(50);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isDraggingRef = useRef(false);
  const parallax = useMouseParallax(8, 0.06);

  const cleanedScrollRef = useRef<HTMLDivElement | null>(null);
  const rawScrollRef = useRef<HTMLDivElement | null>(null);

  const handlePointerDown = () => {
    isDraggingRef.current = true;
  };

  const handlePointerUp = () => {
    isDraggingRef.current = false;
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const clamped = Math.max(5, Math.min(95, (x / rect.width) * 100));
    setSplitPercent(clamped);
  };

  // Synchronize scrolling between the two preview sides
  const handleScrollSync = (source: 'cleaned' | 'raw') => {
    if (source === 'cleaned' && cleanedScrollRef.current && rawScrollRef.current) {
      rawScrollRef.current.scrollTop = cleanedScrollRef.current.scrollTop;
    } else if (source === 'raw' && rawScrollRef.current && cleanedScrollRef.current) {
      cleanedScrollRef.current.scrollTop = rawScrollRef.current.scrollTop;
    }
  };

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      className="relative w-full max-w-4xl mx-auto select-none preserve-3d my-4"
      style={{ perspective: '1200px' }}
    >
      {/* 3D FLOATING ENCLOSURE */}
      <div
        className="relative w-full h-[580px] sm:h-[640px] rounded-3xl bg-[#FFF8ED] border border-[#6B315E]/20 shadow-[0_30px_70px_-15px_rgba(36,22,47,0.18),0_0_30px_rgba(60,141,135,0.12)] overflow-hidden preserve-3d"
        style={{
          transform: `rotateX(${parallax.rotateX * 0.4}deg) rotateY(${parallax.rotateY * 0.4}deg)`,
        }}
      >
        {/* ========================================================================= */}
        {/* 1. LAYER UNDERNEATH: REAL CLEANED PRISTINE DOCUMENT                       */}
        {/* ========================================================================= */}
        <div className="absolute inset-0 p-6 sm:p-8 flex flex-col justify-between font-mono bg-[#FFF8ED]">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-[#EADCC8] flex-shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#3C8D87] to-[#A8D5C2] text-[#FFF8ED] flex items-center justify-center shadow-xs">
                <Check className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#2C2830] font-heading truncate max-w-[200px] sm:max-w-md">
                  {fileName}
                </h4>
                <span className="text-[10px] text-[#3C8D87] font-bold uppercase tracking-wider">
                  AI CLEANED &amp; RESTORED (PRISTINE)
                </span>
              </div>
            </div>
            <span className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-[#A8D5C2]/25 text-[#3C8D87] border border-[#3C8D87]/40">
              PRISTINE
            </span>
          </div>

          {/* Cleaned Content - Real Document Text */}
          <div
            ref={cleanedScrollRef}
            onScroll={() => handleScrollSync('cleaned')}
            className="flex-1 my-3 overflow-y-auto pr-3 text-xs leading-relaxed text-[#2C2830] whitespace-pre-wrap font-sans select-text pointer-events-auto"
          >
            {cleanedText ? (
              <div className="space-y-3">
                {cleanedText.split(/\n{2,}/).map((paragraph, idx) => (
                  <p key={idx} className="text-[#2C2830] leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-[#978D91] italic">
                No cleaned content generated.
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-[#EADCC8] text-[10px] text-[#978D91] flex-shrink-0">
            <span>DocuClean Optical Engine // Finalized</span>
            <span className="text-[#3C8D87] font-bold">INTEGRITY VERIFIED</span>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 2. LAYER ON TOP: REAL ORIGINAL RAW SCAN (CLIPPED TO LEFT OF SPLITPERCENT) */}
        {/* ========================================================================= */}
        <div
          className="absolute inset-0 p-6 sm:p-8 flex flex-col justify-between font-mono bg-gradient-to-br from-[#EADCC8]/60 via-[#FFF8ED] to-[#EADCC8]/40 pointer-events-none"
          style={{
            clipPath: `polygon(0 0, ${splitPercent}% 0, ${splitPercent}% 100%, 0 100%)`,
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-[#C65D45]/30 flex-shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#C65D45] text-white flex items-center justify-center shadow-xs">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#C65D45] font-heading truncate max-w-[200px] sm:max-w-md">
                  {fileName}
                </h4>
                <span className="text-[10px] text-[#C65D45] font-bold uppercase tracking-wider">
                  ORIGINAL UNTOUCHED EXTRACTION
                </span>
              </div>
            </div>
            <span className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-[#C65D45]/15 text-[#C65D45] border border-[#C65D45]/30">
              RAW SOURCE
            </span>
          </div>

          {/* Raw Noisy Content - Real Document Text */}
          <div
            ref={rawScrollRef}
            onScroll={() => handleScrollSync('raw')}
            className="flex-1 my-3 overflow-y-auto pr-3 text-xs leading-relaxed text-[#6F6670] whitespace-pre-wrap font-mono pointer-events-auto"
          >
            {originalText ? (
              <div className="space-y-3">
                {originalText.split(/\n{2,}/).map((paragraph, idx) => (
                  <p key={idx} className="text-[#6F6670] leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-[#C65D45] italic">
                No original source text extracted.
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-[#EADCC8] text-[10px] text-[#C65D45] flex-shrink-0">
            <span>Raw Ingested Document</span>
            <span className="text-[#C65D45] font-bold">RAW ARTIFACTS</span>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 3. DRAGGABLE VERTICAL TRANSFORMATION BOUNDARY (DIVIDER)                   */}
        {/* ========================================================================= */}
        <div
          onPointerDown={handlePointerDown}
          className="absolute top-0 bottom-0 w-1 bg-[#3C8D87] shadow-[0_0_15px_#3C8D87,0_0_30px_#A8D5C2] cursor-ew-resize z-40 flex items-center justify-center -translate-x-1/2 group"
          style={{ left: `${splitPercent}%` }}
        >
          {/* Vertical Laser Aura */}
          <div className="absolute inset-y-0 -left-6 -right-6 bg-gradient-to-r from-transparent via-[#3C8D87]/25 to-transparent pointer-events-none group-hover:via-[#3C8D87]/40 transition-colors" />

          {/* Center Circular Grab Handle */}
          <div className="w-10 h-10 rounded-full bg-[#FFF8ED] border-2 border-[#3C8D87] shadow-[0_0_20px_rgba(60,141,135,0.7),0_10px_20px_rgba(0,0,0,0.15)] flex items-center justify-center text-[#3C8D87] group-hover:scale-110 transition-transform cursor-pointer">
            <MoveHorizontal className="w-5 h-5 text-[#3C8D87]" />
          </div>

          {/* Top Tag Indicator */}
          <div className="absolute top-3 px-2 py-0.5 rounded-full bg-[#24162F] border border-[#3C8D87] text-[8px] font-mono font-bold text-[#A8D5C2] shadow-md whitespace-nowrap">
            TIME SPLIT // {Math.round(splitPercent)}%
          </div>
        </div>
      </div>

      {/* Helper Legend Underneath */}
      <div className="flex items-center justify-between mt-4 px-3 text-xs font-mono text-[#6F6670]">
        <span className="flex items-center gap-1.5 text-[#C65D45] font-bold">
          ← Drag to reveal RAW SOURCE
        </span>
        <span className="text-[#978D91]">Interactive Volumetric Split Boundary</span>
        <span className="flex items-center gap-1.5 text-[#3C8D87] font-bold">
          Drag to reveal AI PRISTINE →
        </span>
      </div>
    </div>
  );
};
