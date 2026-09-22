import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles, AlertCircle, ArrowLeft } from 'lucide-react';
import { useDocument } from '../context/DocumentContext';
import { useAuth } from '../context/AuthContext';
import { upsertUserDocument } from '../services/documentStorage';
import { DocumentChamber } from '../components/DocumentChamber';
import { Button } from '../components/Button';
import { ProgressStepper } from '../components/ProgressStepper';

export const Upload: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { uploadedFile, uploadError, setUploadedFile, removeUploadedFile } = useDocument();
  const [localValidationMessage, setLocalValidationMessage] = useState<string | null>(null);

  const handleFileAccepted = (file: File) => {
    setLocalValidationMessage(null);
    const success = setUploadedFile(file);
    if (success && user?.email) {
      const ext = file.name.split('.').pop()?.toUpperCase() || 'PDF';
      const sizeInKb = file.size / 1024;
      const formattedSize =
        sizeInKb >= 1024 ? `${(sizeInKb / 1024).toFixed(2)} MB` : `${Math.round(sizeInKb)} KB`;
      upsertUserDocument(user.email, {
        fileName: file.name,
        fileType: ext,
        fileSize: formattedSize,
        status: 'Uploaded',
      });
    }
  };

  const handleNext = () => {
    if (!uploadedFile) {
      setLocalValidationMessage('Please introduce a document into the chamber first.');
      return;
    }
    setLocalValidationMessage(null);
    if (user?.email) {
      upsertUserDocument(user.email, {
        fileName: uploadedFile.name,
        fileType: uploadedFile.extension.toUpperCase(),
        fileSize: uploadedFile.formattedSize,
        status: 'Verified',
      });
    }
    navigate('/choose-options');
  };

  const loadSampleDocument = () => {
    const demoContent = `SECTION 1. FINANCIAL AUDIT & REVENUE RECONCILIATION

Dur1ng the f0urth f1scal qu4rter of 2024, our 1ndependent aud1t1ng team conducted an exhaust-
ive forens1c analys1s of the consolidated balance sheet. All line items have been validated against primary bank ledgers without discrepancies.

Cap1tal expend1ture d1sbursements t0taled $ 4 , 285 , 120 , demonstrat1ng an operat1onal var1ance of less than 0.04% across all departments. All statut0ry tax filings have been subm1tted and conf1rmed by revenue commissioners.

Audit Reference: INV - 92841
Tax Variance: 17 . 45 %
Total Revenue: $ 18 , 420 , 950
Net EBITDA: $ 5 , 820 , 100
Rating: AAA COMPLIANT`;

    const blob = new Blob([demoContent], { type: 'text/plain' });
    const sampleFile = new File([blob], 'Demo_Audit_Document.txt', {
      type: 'text/plain',
      lastModified: Date.now(),
    });
    setLocalValidationMessage(null);
    setUploadedFile(sampleFile);
  };

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto pt-2 pb-12 animate-in fade-in duration-300">
      {/* Progress Stepper */}
      <ProgressStepper />

      {/* Page Title & Intro */}
      <div className="text-center max-w-xl mx-auto space-y-2 mb-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF8ED] border border-[#6B315E]/20 text-[#3C8D87] text-xs font-mono font-bold uppercase tracking-wider shadow-xs">
          <span className="w-2 h-2 rounded-full bg-[#3C8D87] animate-pulse" />
          Document Entry Chamber
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#2C2830] tracking-tight font-heading">
          Ingest Document Into Machine
        </h1>
        <p className="text-sm text-[#6F6670]">
          Position your document inside the chamber. Docu-Bot and optical sensors will scan and materialize your file in real time.
        </p>
      </div>

      {/* 3D Scanning Chamber */}
      <DocumentChamber
        onFileAccepted={handleFileAccepted}
        isStagedFile={!!uploadedFile}
        fileName={uploadedFile?.name}
        fileSize={uploadedFile?.formattedSize}
        onClear={removeUploadedFile}
        onValidationError={setLocalValidationMessage}
      />

      {/* Sample Document Demo Ingestion */}
      {!uploadedFile && (
        <div className="flex flex-col sm:flex-row items-center justify-between p-4 rounded-2xl bg-[#FFF8ED]/85 border border-[#6B315E]/20 text-xs text-[#2C2830] gap-3 max-w-xl mx-auto w-full shadow-xs">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#C65D45] flex-shrink-0" />
            <span>Don&apos;t have a file ready? Materialize our sample audit report into the chamber.</span>
          </div>
          <button
            type="button"
            onClick={loadSampleDocument}
            className="secondary-btn px-4 py-2 rounded-xl font-bold text-xs flex-shrink-0 cursor-pointer shadow-xs hover:bg-[#FFF8ED]"
          >
            Materialize Sample
          </button>
        </div>
      )}

      {/* Local Validation Error Banner */}
      {(localValidationMessage || uploadError) && (
        <div className="p-3.5 rounded-2xl bg-[#FFF8ED] border border-[#E98268]/60 flex items-center justify-center gap-2.5 text-[#C65D45] text-xs sm:text-sm font-bold shadow-xs animate-in fade-in duration-200 max-w-xl mx-auto w-full text-center">
          <AlertCircle className="w-4 h-4 flex-shrink-0 text-[#C65D45]" />
          <span>{localValidationMessage || uploadError}</span>
        </div>
      )}

      {/* Navigation Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-[#EADCC8] max-w-xl mx-auto w-full">
        <button
          type="button"
          onClick={() => navigate('/')}
          className="secondary-btn w-full sm:w-auto h-11 px-5 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>

        <Button
          onClick={handleNext}
          rightIcon={<ArrowRight className="w-4 h-4 ml-1" />}
          size="md"
          className="w-full sm:w-auto h-11"
        >
          Next: Choose Options
        </Button>
      </div>
    </div>
  );
};
