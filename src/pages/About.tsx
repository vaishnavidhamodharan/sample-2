import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Sparkles, Cpu, Award, ArrowRight, Lock, CheckCircle2 } from 'lucide-react';
import { Button } from '../components/Button';

export const About: React.FC = () => {
  return (
    <div className="flex flex-col gap-12 w-full max-w-4xl mx-auto select-none pt-2">
      {/* Header */}
      <div className="text-center space-y-3">
        <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#3C8D87] block">
          Platform Architecture
        </span>
        <h1 className="font-heading font-black text-3xl sm:text-4xl text-[#24162F] tracking-tight">
          About DocuClean AI
        </h1>
        <p className="text-sm text-[#6F6670] leading-relaxed max-w-xl mx-auto">
          Built for enterprises, legal teams, researchers, and financial institutions needing impeccable document precision.
        </p>
      </div>

      {/* Main Story Cards */}
      <div className="space-y-6">
        <div className="p-6 sm:p-8 rounded-3xl bg-[#FFF8ED] border border-[#6B315E]/15 shadow-sm space-y-4">
          <h2 className="font-heading font-extrabold text-xl text-[#24162F]">
            The Degradation Problem in Digital Document Ingestion
          </h2>
          <p className="text-xs sm:text-sm text-[#6F6670] leading-relaxed">
            Every day, millions of scanned papers, faxed reports, invoice PDFs, and legacy archives are fed into AI agents and enterprise databases. Unfortunately, traditional OCR introduces systematic errors: erratic character spacing, broken line breaks mid-sentence, phantom punctuation, and corrupted tables.
          </p>
          <p className="text-xs sm:text-sm text-[#6F6670] leading-relaxed">
            DocuClean AI was engineered to bridge this gap: providing an intelligent, deterministic, and AI-assisted restorative pipeline that rebuilds document fidelity in milliseconds.
          </p>
        </div>

        {/* Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-[#FFF8ED] border border-[#EADCC8] flex flex-col justify-between">
            <div className="w-10 h-10 rounded-xl bg-[#3C8D87]/15 text-[#3C8D87] flex items-center justify-center mb-4">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="font-heading font-extrabold text-base text-[#24162F] mb-1">
              Zero-Retention Buffers
            </h3>
            <p className="text-xs text-[#6F6670] leading-relaxed">
              Files are processed in ephemeral memory and automatically purged after session export. No persistent document training data is collected.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-[#FFF8ED] border border-[#EADCC8] flex flex-col justify-between">
            <div className="w-10 h-10 rounded-xl bg-[#6B315E]/15 text-[#6B315E] flex items-center justify-center mb-4">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="font-heading font-extrabold text-base text-[#24162F] mb-1">
              Gemini 2.5 Multi-Stage
            </h3>
            <p className="text-xs text-[#6F6670] leading-relaxed">
              Utilizes Google's state-of-the-art multimodal vision and language capabilities to understand complex document contexts without tampering with facts.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-[#FFF8ED] border border-[#EADCC8] flex flex-col justify-between">
            <div className="w-10 h-10 rounded-xl bg-[#C65D45]/15 text-[#C65D45] flex items-center justify-center mb-4">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="font-heading font-extrabold text-base text-[#24162F] mb-1">
              Deterministic Rules
            </h3>
            <p className="text-xs text-[#6F6670] leading-relaxed">
              Synthesizes regex and heuristic transforms with semantic intelligence to ensure mathematical entities, dates, and amounts are 100% stable.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Box */}
      <div className="p-8 rounded-3xl bg-[#24162F] text-[#FFF8ED] flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
        <div>
          <h3 className="font-heading font-extrabold text-xl text-white mb-1">
            Experience the Engine Live
          </h3>
          <p className="text-xs text-[#A8D5C2]">
            Upload a degraded test PDF or sample scan to see instant results.
          </p>
        </div>
        <Link to="/upload">
          <Button size="md" className="bg-[#3C8D87] hover:bg-[#4ea8a1] text-white border-0">
            Upload Document
          </Button>
        </Link>
      </div>
    </div>
  );
};
