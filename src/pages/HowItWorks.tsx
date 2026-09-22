import React from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Layers,
  Cpu,
  FileCheck2,
  FileSearch,
  CheckCircle,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import { AIPipeline } from '../components/AIPipeline';
import { Button } from '../components/Button';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      num: '01',
      title: 'Digital & Optical Ingestion',
      desc: 'Documents (PDF, DOCX, TXT, PNG, JPG) are parsed in an isolated memory buffer. True digital text is extracted via native parsers, while rasterized scans trigger high-precision OCR.',
      badge: 'Multi-Parser Engine',
    },
    {
      num: '02',
      title: 'Structural Heuristic Filtering',
      desc: 'Removes artificial spacing ("S E C T I O N" -> "SECTION"), corrects hard wrap line splits, cleans random printer dust symbols, and reconciles hyphenated words.',
      badge: 'Deterministic Regex Pass',
    },
    {
      num: '03',
      title: 'Gemini AI Semantic Refinement',
      desc: 'Gemini 2.5 Flash reviews context-sensitive OCR misreads (e.g. "rn" -> "m", "l1" -> "li") without mutating exact numerical values, codes, or formulas.',
      badge: 'Zero-Hallucination AI',
    },
    {
      num: '04',
      title: 'Vector & Layout Compilation',
      desc: 'The restored text is structured into semantic paragraphs, lists, and headings, and compiled directly into vector PDF, editable DOCX, or clean UTF-8 text.',
      badge: 'Multi-Format Export',
    },
  ];

  return (
    <div className="flex flex-col gap-12 w-full max-w-5xl mx-auto select-none pt-2">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#3C8D87] block">
          Restoration Methodology
        </span>
        <h1 className="font-heading font-black text-3xl sm:text-4xl text-[#24162F] tracking-tight">
          How DocuClean AI Restores Documents
        </h1>
        <p className="text-sm text-[#6F6670] leading-relaxed">
          A hybrid architecture combining high-speed deterministic heuristics with deep semantic AI for bulletproof document fidelity.
        </p>
      </div>

      {/* Interactive Pipeline Visual */}
      <div className="w-full">
        <AIPipeline />
      </div>

      {/* Step Breakdown Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
        {steps.map((step) => (
          <div
            key={step.num}
            className="p-6 rounded-3xl bg-[#FFF8ED] border border-[#6B315E]/15 shadow-sm flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="font-mono font-black text-2xl text-[#6B315E]/40">
                  {step.num}
                </span>
                <span className="text-[11px] font-mono font-bold px-2.5 py-1 rounded-lg bg-[#EADCC8]/60 text-[#6B315E]">
                  {step.badge}
                </span>
              </div>
              <h3 className="font-heading font-extrabold text-lg text-[#24162F] mb-2">
                {step.title}
              </h3>
              <p className="text-xs sm:text-sm text-[#6F6670] leading-relaxed">
                {step.desc}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Safety & Integrity Guarantee */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#EADCC8]/40 border border-[#6B315E]/20 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-[#3C8D87] font-bold text-sm">
            <CheckCircle className="w-4 h-4" />
            <span>Strict Zero-Hallucination Policy</span>
          </div>
          <p className="text-xs text-[#6F6670] max-w-xl leading-relaxed">
            DocuClean AI never creates synthetic content or paraphrases your text. The original wording, legal references, numbers, and layout logic remain 100% true to source.
          </p>
        </div>

        <Link to="/upload">
          <Button size="md" rightIcon={<ArrowRight className="w-4 h-4" />}>
            Test with a Document
          </Button>
        </Link>
      </div>
    </div>
  );
};
