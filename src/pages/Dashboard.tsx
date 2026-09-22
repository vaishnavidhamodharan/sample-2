import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  UploadCloud,
  FileCheck2,
  ShieldCheck,
  Zap,
  Layers,
  FileSearch,
  ArrowRight,
  CheckCircle,
} from 'lucide-react';
import { DocumentChamber } from '../components/DocumentChamber';
import { Button } from '../components/Button';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-16 md:gap-24 w-full select-none">
      {/* Hero Section with 3D Document Chamber */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center pt-2 md:pt-6">
        {/* Left Column: Heading & Value Proposition */}
        <div className="lg:col-span-6 flex flex-col items-start text-left">
          {/* Subtle Tag Pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#EADCC8]/60 border border-[#6B315E]/15 text-[#6B315E] text-xs font-mono font-bold mb-6 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-[#3C8D87]" />
            <span>AI-POWERED DOCUMENT RESTORATION</span>
          </div>

          <h1 className="font-heading font-black text-3xl sm:text-5xl lg:text-5xl text-[#24162F] tracking-tight leading-[1.12] mb-5">
            Turn messy, degraded docs into{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6B315E] to-[#3C8D87]">
              pristine digital assets
            </span>
          </h1>

          <p className="text-base sm:text-lg text-[#6F6670] leading-relaxed mb-8 max-w-xl">
            Instantly eliminate OCR noise, erratic letter spaces, fragmented line breaks, and scanned artifacts while preserving exact tables, numbers, and layout integrity.
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 w-full sm:w-auto">
            <Link to="/upload" className="w-full sm:w-auto">
              <Button
                size="lg"
                leftIcon={<UploadCloud className="w-5 h-5 text-[#A8D5C2]" />}
                className="w-full sm:w-auto text-sm sm:text-base font-extrabold"
              >
                Upload &amp; Clean Document
              </Button>
            </Link>
            <Link to="/how-it-works" className="w-full sm:w-auto">
              <button
                type="button"
                className="secondary-btn w-full sm:w-auto h-12 px-6 rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <span>Explore Engine</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-6 pt-8 mt-8 border-t border-[#EADCC8] w-full max-w-md">
            <div>
              <span className="block font-heading font-black text-2xl text-[#24162F]">99.8%</span>
              <span className="text-[11px] font-mono text-[#6F6670] uppercase">OCR Precision</span>
            </div>
            <div>
              <span className="block font-heading font-black text-2xl text-[#3C8D87]">&lt; 1.5s</span>
              <span className="text-[11px] font-mono text-[#6F6670] uppercase">Processing</span>
            </div>
            <div>
              <span className="block font-heading font-black text-2xl text-[#6B315E]">50 MB</span>
              <span className="text-[11px] font-mono text-[#6F6670] uppercase">Max File Size</span>
            </div>
          </div>
        </div>

        {/* Right Column: 3D Interactive Document Stage */}
        <div className="lg:col-span-6 flex justify-center w-full">
          <DocumentChamber />
        </div>
      </section>

      {/* Feature Capabilities Grid */}
      <section className="w-full flex flex-col items-center text-center">
        <div className="max-w-2xl mx-auto mb-10">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#3C8D87] block mb-2">
            Engine Capabilities
          </span>
          <h2 className="font-heading font-black text-2xl sm:text-3xl text-[#24162F] tracking-tight">
            Designed for critical documents that cannot afford errors
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
          {/* Card 1 */}
          <div className="p-6 rounded-3xl bg-[#FFF8ED] border border-[#6B315E]/15 shadow-sm flex flex-col items-start text-left hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-[#6B315E]/10 text-[#6B315E] flex items-center justify-center mb-4">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-extrabold text-base text-[#24162F] mb-2">
              Hyphenation &amp; Broken Line Repair
            </h3>
            <p className="text-xs text-[#6F6670] leading-relaxed">
              Detects hyphenated line-end splits like "reconcili- ation" and seamlessly joins them into complete terms without disrupting true bullet points or paragraph bounds.
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-6 rounded-3xl bg-[#FFF8ED] border border-[#3C8D87]/20 shadow-sm flex flex-col items-start text-left hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-[#3C8D87]/10 text-[#3C8D87] flex items-center justify-center mb-4">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-extrabold text-base text-[#24162F] mb-2">
              Critical Entity Preservation
            </h3>
            <p className="text-xs text-[#6F6670] leading-relaxed">
              Guarantees zero-hallucination retention of invoice numbers (INV-92841), tax percentages (17.45%), account identifiers, and currency values.
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-6 rounded-3xl bg-[#FFF8ED] border border-[#C65D45]/20 shadow-sm flex flex-col items-start text-left hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-[#C65D45]/10 text-[#C65D45] flex items-center justify-center mb-4">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-extrabold text-base text-[#24162F] mb-2">
              Multi-Format Native Export
            </h3>
            <p className="text-xs text-[#6F6670] leading-relaxed">
              Directly compile cleaned documents back into vector PDF, editable Microsoft Word (.docx), or UTF-8 clean text with calibrated line feeds.
            </p>
          </div>
        </div>
      </section>

      {/* Interactive Ready Banner */}
      <section className="w-full p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-[#24162F] to-[#6B315E] text-[#FFF8ED] flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
        <div className="text-left space-y-2 max-w-xl">
          <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-white tracking-tight">
            Ready to clean your document right now?
          </h2>
          <p className="text-xs sm:text-sm text-[#A8D5C2]">
            Drag &amp; drop any PDF, DOCX, TXT, or scan. No complicated setup required.
          </p>
        </div>

        <Link to="/upload" className="w-full md:w-auto">
          <Button
            size="lg"
            className="w-full md:w-auto bg-[#3C8D87] hover:bg-[#499f99] text-white border-0 shadow-lg shadow-black/30 font-extrabold"
          >
            Start Document Cleaning
          </Button>
        </Link>
      </section>
    </div>
  );
};
