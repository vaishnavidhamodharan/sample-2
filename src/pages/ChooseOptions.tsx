import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDocument } from '../context/DocumentContext';
import { ProgressStepper } from '../components/ProgressStepper';
import { AIToolbox, TOOLBOX_MODULES } from '../components/AIToolbox';
import { Button } from '../components/Button';
import { FileText, ArrowRight, ArrowLeft, CheckSquare, Sparkles } from 'lucide-react';

export const ChooseOptions: React.FC = () => {
  const navigate = useNavigate();
  const {
    uploadedFile,
    selectedOptions,
    toggleOption,
    setSelectedOptions,
    startRealProcessing,
    isProcessing,
  } = useDocument();

  // If no file uploaded, redirect back to upload step
  useEffect(() => {
    if (!uploadedFile) {
      navigate('/upload');
    }
  }, [uploadedFile, navigate]);

  const handleSelectAll = () => {
    const allIds = TOOLBOX_MODULES.map((m) => m.id);
    setSelectedOptions(allIds);
  };

  const handleSelectRecommended = () => {
    const recommendedIds = TOOLBOX_MODULES.filter((m) => m.recommended).map((m) => m.id);
    setSelectedOptions(recommendedIds);
  };

  const handleProceed = () => {
    navigate('/processing');
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-5xl mx-auto select-none pt-2">
      {/* Workflow Stepper */}
      <ProgressStepper />

      {/* Header & File Info */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#EADCC8]">
        <div>
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#3C8D87] block mb-1">
            Step 2: Configuration
          </span>
          <h1 className="font-heading font-black text-2xl sm:text-3xl text-[#24162F] tracking-tight">
            Select Cleaning &amp; Restoration Modules
          </h1>
          <p className="text-xs sm:text-sm text-[#6F6670] mt-1">
            Toggle the specialized restoration layers to apply to your document.
          </p>
        </div>

        {uploadedFile && (
          <div className="flex items-center gap-3 bg-[#FFF8ED] p-3 rounded-2xl border border-[#6B315E]/15 shadow-xs">
            <div className="w-9 h-9 rounded-xl bg-[#6B315E]/10 text-[#6B315E] flex items-center justify-center font-bold font-mono text-xs">
              {uploadedFile.extension.toUpperCase()}
            </div>
            <div className="text-left">
              <span className="text-xs font-bold text-[#2C2830] block truncate max-w-[180px]">
                {uploadedFile.name}
              </span>
              <span className="text-[10px] text-[#978D91] font-mono block">
                {uploadedFile.formattedSize}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Quick Controls */}
      <div className="flex items-center justify-between flex-wrap gap-2 text-xs">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleSelectRecommended}
            className="px-3 py-1.5 rounded-xl bg-[#EADCC8]/60 hover:bg-[#EADCC8] text-[#24162F] font-bold font-mono transition-colors cursor-pointer"
          >
            Recommended Preset
          </button>
          <button
            type="button"
            onClick={handleSelectAll}
            className="px-3 py-1.5 rounded-xl border border-[#6B315E]/20 hover:bg-[#FFF8ED] text-[#6B315E] font-bold font-mono transition-colors cursor-pointer"
          >
            Select All ({TOOLBOX_MODULES.length})
          </button>
        </div>

        <span className="font-mono text-xs font-bold text-[#3C8D87]">
          {selectedOptions.length} of {TOOLBOX_MODULES.length} modules active
        </span>
      </div>

      {/* Toolbox Grid */}
      <AIToolbox
        selectedOptions={selectedOptions}
        onToggle={toggleOption}
      />

      {/* Action Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6 border-t border-[#EADCC8] mt-4">
        <button
          type="button"
          onClick={() => navigate('/upload')}
          className="secondary-btn w-full sm:w-auto h-12 px-6 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Upload
        </button>

        <Button
          onClick={handleProceed}
          disabled={selectedOptions.length === 0 || isProcessing}
          size="lg"
          rightIcon={<ArrowRight className="w-4 h-4 text-[#A8D5C2]" />}
          className="w-full sm:w-auto font-extrabold"
        >
          Run Document Restoration
        </Button>
      </div>
    </div>
  );
};
