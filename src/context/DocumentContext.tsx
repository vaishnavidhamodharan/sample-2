import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import { DocumentContextType, DownloadFormat, ProcessedDocumentData, UploadedFileInfo } from '../types';
import {
  uploadDocumentApi,
  processDocumentApi,
  downloadCleanedDocumentApi,
} from '../services/api';

const MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024; // 50MB
const ALLOWED_EXTENSIONS = ['pdf', 'doc', 'docx', 'txt', 'png', 'jpg', 'jpeg'];

const DocumentContext = createContext<DocumentContextType | undefined>(undefined);

export const DocumentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [uploadedFile, setUploadedFileState] = useState<UploadedFileInfo | null>(() => {
    const saved = sessionStorage.getItem('docclean_file');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    return null;
  });

  const [documentId, setDocumentId] = useState<string | null>(() => {
    return sessionStorage.getItem('docclean_doc_id') || null;
  });

  const [selectedOptions, setSelectedOptions] = useState<string[]>(() => {
    const saved = sessionStorage.getItem('docclean_options');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return ['remove-spaces', 'fix-line-breaks', 'remove-noise', 'normalize-formatting', 'correct-ocr'];
      }
    }
    return ['remove-spaces', 'fix-line-breaks', 'remove-noise', 'normalize-formatting', 'correct-ocr'];
  });

  const [processingProgress, setProcessingProgress] = useState<number>(0);
  const [processingStage, setProcessingStage] = useState<string>('Ready');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [selectedDownloadFormat, setSelectedDownloadFormat] = useState<DownloadFormat>('pdf');
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [processingError, setProcessingError] = useState<string | null>(null);
  const [showDownloadSuccess, setShowDownloadSuccess] = useState<boolean>(false);
  const downloadTimerRef = useRef<NodeJS.Timeout | null>(null);

  const [processedDocument, setProcessedDocument] = useState<ProcessedDocumentData | null>(() => {
    const saved = sessionStorage.getItem('docclean_processed');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    return null;
  });

  // Sync safe non-file metadata to sessionStorage
  useEffect(() => {
    if (uploadedFile) {
      const { rawFile, ...serializable } = uploadedFile;
      sessionStorage.setItem('docclean_file', JSON.stringify(serializable));
    } else {
      sessionStorage.removeItem('docclean_file');
    }
  }, [uploadedFile]);

  useEffect(() => {
    if (documentId) {
      sessionStorage.setItem('docclean_doc_id', documentId);
    } else {
      sessionStorage.removeItem('docclean_doc_id');
    }
  }, [documentId]);

  useEffect(() => {
    sessionStorage.setItem('docclean_options', JSON.stringify(selectedOptions));
  }, [selectedOptions]);

  useEffect(() => {
    if (processedDocument) {
      sessionStorage.setItem('docclean_processed', JSON.stringify(processedDocument));
    } else {
      sessionStorage.removeItem('docclean_processed');
    }
  }, [processedDocument]);

  const triggerDownloadSuccess = () => {
    if (downloadTimerRef.current) {
      clearTimeout(downloadTimerRef.current);
    }
    setShowDownloadSuccess(true);
    downloadTimerRef.current = setTimeout(() => {
      setShowDownloadSuccess(false);
    }, 1800);
  };

  /**
   * Accepts a real user File, validates it, and uploads it to the backend
   */
  const setUploadedFile = (file: File | null): boolean => {
    setUploadError(null);
    setProcessingError(null);

    if (!file) {
      setUploadedFileState(null);
      setDocumentId(null);
      return false;
    }

    // Size validation
    if (file.size > MAX_FILE_SIZE_BYTES) {
      setUploadError('File size exceeds the maximum supported limit of 50 MB.');
      return false;
    }

    // Extension validation
    const parts = file.name.split('.');
    const ext = parts.length > 1 ? parts.pop()!.toLowerCase() : '';

    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      setUploadError(`Unsupported document format (.${ext || 'unknown'}). Supported: ${ALLOWED_EXTENSIONS.join(', ').toUpperCase()}`);
      return false;
    }

    // Format size
    const sizeInKb = file.size / 1024;
    const formattedSize =
      sizeInKb >= 1024
        ? `${(sizeInKb / 1024).toFixed(2)} MB`
        : `${Math.round(sizeInKb)} KB`;

    const fileInfo: UploadedFileInfo = {
      name: file.name,
      size: file.size,
      formattedSize,
      type: file.type || `application/${ext}`,
      extension: ext,
      rawFile: file,
      uploadedAt: new Date(),
    };

    setUploadedFileState(fileInfo);
    setProcessedDocument(null);

    // Asynchronously upload to backend to obtain real documentId
    uploadDocumentApi(file)
      .then((res) => {
        if (res.documentId) {
          setDocumentId(res.documentId);
          setUploadedFileState((prev) => (prev ? { ...prev, documentId: res.documentId } : null));
        }
      })
      .catch((err) => {
        console.warn('Initial background upload failed, will retry on process:', err);
      });

    return true;
  };

  const removeUploadedFile = () => {
    setUploadedFileState(null);
    setDocumentId(null);
    setUploadError(null);
    setProcessingError(null);
    setProcessedDocument(null);
    setProcessingProgress(0);
    setProcessingStage('Ready');
    sessionStorage.removeItem('docclean_file');
    sessionStorage.removeItem('docclean_doc_id');
    sessionStorage.removeItem('docclean_processed');
  };

  const toggleOption = (id: string) => {
    setSelectedOptions((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  /**
   * Real document processing execution
   */
  const startRealProcessing = async (onComplete?: () => void): Promise<void> => {
    if (isProcessing) return;

    if (!uploadedFile) {
      setProcessingError('No uploaded document found. Please upload a document to proceed.');
      return;
    }

    setIsProcessing(true);
    setProcessingError(null);
    setProcessingProgress(10);
    setProcessingStage('Ingesting document layers into optical neural buffer');

    try {
      let activeDocId = documentId || uploadedFile.documentId;

      // If documentId hasn't been established yet and rawFile exists, upload now
      if (!activeDocId && uploadedFile.rawFile) {
        setProcessingProgress(20);
        setProcessingStage('Transmitting document bytes to secure processing engine');
        const uploadRes = await uploadDocumentApi(uploadedFile.rawFile);
        activeDocId = uploadRes.documentId;
        setDocumentId(activeDocId);
        setUploadedFileState((prev) => (prev ? { ...prev, documentId: activeDocId } : null));
      }

      if (!activeDocId) {
        throw new Error('Document session expired or file was not uploaded. Please re-upload your document.');
      }

      // Smooth progress animation alongside real backend execution
      const stageTimer1 = setTimeout(() => {
        setProcessingProgress(35);
        setProcessingStage('Analyzing typography, noise & geometric distortions');
      }, 400);

      const stageTimer2 = setTimeout(() => {
        setProcessingProgress(65);
        setProcessingStage('Executing OCR reconstruction & deterministic cleaning');
      }, 900);

      const stageTimer3 = setTimeout(() => {
        setProcessingProgress(88);
        setProcessingStage('Restoring structural clarity & validating text integrity');
      }, 1500);

      // Call real backend processing endpoint
      const result = await processDocumentApi(activeDocId, selectedOptions);

      clearTimeout(stageTimer1);
      clearTimeout(stageTimer2);
      clearTimeout(stageTimer3);

      setProcessingProgress(100);
      setProcessingStage('Document cleaned successfully.');
      setProcessedDocument(result);
      setIsProcessing(false);

      if (onComplete) {
        onComplete();
      }
    } catch (err) {
      console.error('Processing failed:', err);
      setIsProcessing(false);
      setProcessingError((err as Error).message || 'Failed to process document.');
      setProcessingProgress(0);
      setProcessingStage('Processing failed');
    }
  };

  /**
   * Unified interface for processing (satisfies existing callers)
   */
  const startProcessingSimulation = (onComplete?: () => void) => {
    startRealProcessing(onComplete);
  };

  /**
   * Downloads the real processed document from the backend
   */
  const downloadProcessedFile = async (format?: DownloadFormat): Promise<void> => {
    const targetFormat = format || selectedDownloadFormat;
    const activeDocId = processedDocument?.documentId || documentId || uploadedFile?.documentId;

    if (!activeDocId) {
      throw new Error('Document is no longer available. Please upload and process it again.');
    }

    const defaultName = uploadedFile?.name
      ? uploadedFile.name.replace(/\.[^/.]+$/, `_cleaned.${targetFormat}`)
      : `cleaned_document.${targetFormat}`;

    await downloadCleanedDocumentApi(activeDocId, targetFormat, defaultName);
    triggerDownloadSuccess();
  };

  const resetWorkflow = () => {
    setUploadedFileState(null);
    setDocumentId(null);
    setProcessedDocument(null);
    setProcessingProgress(0);
    setProcessingStage('Ready');
    setSelectedDownloadFormat('pdf');
    setUploadError(null);
    setProcessingError(null);
    sessionStorage.clear();
  };

  return (
    <DocumentContext.Provider
      value={{
        uploadedFile,
        documentId,
        selectedOptions,
        processingProgress,
        processingStage,
        selectedDownloadFormat,
        processedDocument,
        isProcessing,
        uploadError,
        processingError,
        showDownloadSuccess,
        triggerDownloadSuccess,
        setUploadedFile,
        removeUploadedFile,
        toggleOption,
        setSelectedOptions,
        setSelectedDownloadFormat,
        startProcessingSimulation,
        startRealProcessing,
        downloadProcessedFile,
        resetWorkflow,
      }}
    >
      {children}
    </DocumentContext.Provider>
  );
};

export const useDocument = () => {
  const context = useContext(DocumentContext);
  if (!context) {
    throw new Error('useDocument must be used within a DocumentProvider');
  }
  return context;
};
