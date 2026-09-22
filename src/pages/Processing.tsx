import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDocument } from '../context/DocumentContext';
import { useAuth } from '../context/AuthContext';
import { updateUserDocumentStatus } from '../services/documentStorage';
import { ProcessingScene } from '../components/ProcessingScene';
import { ProgressStepper } from '../components/ProgressStepper';

export const Processing: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    uploadedFile,
    processingProgress,
    processingStage,
    processingError,
    startRealProcessing,
  } = useDocument();

  const startedRef = useRef(false);

  useEffect(() => {
    // If user lands here directly without a file, redirect to upload
    if (!uploadedFile) {
      navigate('/upload');
      return;
    }

    if (user?.email) {
      updateUserDocumentStatus(user.email, uploadedFile.name, 'Cleaning');
    }

    if (!startedRef.current) {
      startedRef.current = true;
      startRealProcessing(() => {
        // At 100%, show brief completion then auto-navigate to /preview
        setTimeout(() => {
          navigate('/preview');
        }, 1100);
      });
    }
  }, [uploadedFile, navigate, startRealProcessing, user]);

  return (
    <div className="flex flex-col gap-4 max-w-5xl mx-auto pt-2 pb-12 animate-in fade-in duration-300">
      {/* Stepper */}
      <ProgressStepper />

      {/* Error state if backend processing failed */}
      {processingError ? (
        <div className="p-8 rounded-3xl bg-[#FFF8ED] border-2 border-red-200 shadow-xl max-w-xl mx-auto text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto text-xl font-bold">
            !
          </div>
          <h2 className="text-xl font-bold text-[#2C2830]">Processing Encountered an Issue</h2>
          <p className="text-sm text-[#6F6670]">{processingError}</p>
          <div className="flex justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => {
                startedRef.current = false;
                startRealProcessing(() => {
                  setTimeout(() => navigate('/preview'), 1100);
                });
              }}
              className="primary-btn text-white px-5 py-2.5 rounded-xl text-xs font-bold"
            >
              Retry Processing
            </button>
            <button
              type="button"
              onClick={() => navigate('/upload')}
              className="secondary-btn px-5 py-2.5 rounded-xl text-xs font-bold"
            >
              Back to Upload
            </button>
          </div>
        </div>
      ) : (
        /* Main 3D AI Processing World Scene */
        <ProcessingScene
          progress={processingProgress}
          stageName={processingStage}
          fileName={uploadedFile?.name}
        />
      )}
    </div>
  );
};
