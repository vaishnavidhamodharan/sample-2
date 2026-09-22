import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDocument } from '../context/DocumentContext';
import { useAuth } from '../context/AuthContext';
import { saveUserDocument } from '../services/documentStorage';
import { MaterializationAnimation } from '../components/MaterializationAnimation';
import { ProgressStepper } from '../components/ProgressStepper';

export const Downloading: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    uploadedFile,
    processedDocument,
    selectedDownloadFormat,
    downloadProcessedFile,
  } = useDocument();

  const [downloadProgress, setDownloadProgress] = useState(0);
  const [downloadStage, setDownloadStage] = useState('Packaging document layers into digital object');
  const [downloadError, setDownloadError] = useState<string | null>(null);
  const startedRef = useRef(false);

  useEffect(() => {
    // If no document exists, redirect to upload
    if (!uploadedFile && !processedDocument) {
      navigate('/upload');
      return;
    }

    if (startedRef.current) return;
    startedRef.current = true;

    const stages = [
      { progress: 25, stage: 'Compressing typography matrices into object', delay: 400 },
      { progress: 55, stage: `Morphing format layers into .${selectedDownloadFormat.toUpperCase()}`, delay: 500 },
      { progress: 85, stage: 'Streaming object through volumetric data tunnel', delay: 450 },
      { progress: 100, stage: 'Materializing inside local device storage', delay: 400 },
    ];

    let index = 0;
    const executeNext = () => {
      if (index < stages.length) {
        const item = stages[index];
        setDownloadProgress(item.progress);
        setDownloadStage(item.stage);
        index++;
        setTimeout(executeNext, item.delay);
      } else {
        // Trigger real backend file download
        downloadProcessedFile(selectedDownloadFormat)
          .then(() => {
            // Record in user document history if logged in
            if (user?.email) {
              const docName =
                uploadedFile?.name ||
                `${processedDocument?.title || 'cleaned_document'}.${selectedDownloadFormat}`;
              saveUserDocument(user.email, {
                fileName: docName,
                fileType: selectedDownloadFormat.toUpperCase(),
                fileSize: uploadedFile?.formattedSize || '1.8 MB',
                date: new Date().toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                }),
                status: 'Downloaded',
              });
            }

            setTimeout(() => {
              navigate('/success');
            }, 600);
          })
          .catch((err) => {
            console.error('Download execution error:', err);
            setDownloadError((err as Error).message || 'Failed to download document.');
          });
      }
    };

    executeNext();
  }, [navigate, processedDocument, selectedDownloadFormat, uploadedFile, user, downloadProcessedFile]);

  return (
    <div className="flex flex-col gap-6 max-w-2xl mx-auto pt-2 pb-12 items-center text-center animate-in fade-in duration-300 select-none">
      {/* Stepper */}
      <ProgressStepper />

      {/* Main Materialization Animation Through Data Tunnel */}
      <div className="w-full p-6 sm:p-8 rounded-3xl border border-[#6B315E]/20 bg-[#FFF8ED]/95 shadow-2xl flex flex-col items-center relative overflow-hidden preserve-3d">
        {downloadError ? (
          <div className="py-8 space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto text-xl font-bold">
              !
            </div>
            <h3 className="text-lg font-bold text-[#2C2830]">Download Failed</h3>
            <p className="text-xs text-[#6F6670] max-w-sm">{downloadError}</p>
            <div className="pt-2 flex justify-center gap-3">
              <button
                type="button"
                onClick={() => navigate('/preview')}
                className="secondary-btn px-4 py-2 rounded-xl text-xs font-bold"
              >
                Back to Preview
              </button>
              <button
                type="button"
                onClick={() => navigate('/upload')}
                className="primary-btn text-white px-4 py-2 rounded-xl text-xs font-bold"
              >
                Upload Again
              </button>
            </div>
          </div>
        ) : (
          <MaterializationAnimation
            format={selectedDownloadFormat}
            progress={downloadProgress}
            stageName={downloadStage}
          />
        )}
      </div>
    </div>
  );
};
