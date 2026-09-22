import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Shield, Cpu, Lock } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-[#EADCC8] bg-[#FFF8ED]/80 mt-auto py-10 px-4 sm:px-8 text-xs text-[#6F6670] select-none">
      <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Brand & Mission */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-[#24162F] text-[#FFF8ED] flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-[#A8D5C2]" />
          </div>
          <div>
            <span className="font-heading font-bold text-sm text-[#24162F]">DocuClean AI</span>
            <p className="text-[11px] text-[#978D91]">Volumetric OCR &amp; Document Restoration Engine</p>
          </div>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap items-center gap-4 text-[11px] font-mono">
          <span className="flex items-center gap-1 text-[#3C8D87]">
            <Shield className="w-3.5 h-3.5" /> Client-Side Encryption
          </span>
          <span className="flex items-center gap-1 text-[#6B315E]">
            <Cpu className="w-3.5 h-3.5" /> Gemini 2.5 Multi-Stage Cleaning
          </span>
          <span className="flex items-center gap-1 text-[#2C2830]">
            <Lock className="w-3.5 h-3.5" /> Ephemeral Buffer Storage
          </span>
        </div>

        {/* Links */}
        <div className="flex items-center gap-4 font-bold text-[#6F6670]">
          <Link to="/" className="hover:text-[#6B315E] transition-colors">Home</Link>
          <Link to="/how-it-works" className="hover:text-[#6B315E] transition-colors">How It Works</Link>
          <Link to="/about" className="hover:text-[#6B315E] transition-colors">About</Link>
          <Link to="/documents" className="hover:text-[#6B315E] transition-colors">My Documents</Link>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto mt-6 pt-6 border-t border-[#EADCC8]/60 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#978D91]">
        <span>© 2026 DocuClean AI. All rights reserved.</span>
        <span>Secure Document Processing Platform</span>
      </div>
    </footer>
  );
};
