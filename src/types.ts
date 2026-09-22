export interface CleaningOptionItem {
  id: string;
  title: string;
  description: string;
  category?: string;
  recommended?: boolean;
}

export interface UploadedFileInfo {
  name: string;
  size: number;
  formattedSize: string;
  type: string;
  extension: string;
  rawFile?: File;
  previewUrl?: string;
  uploadedAt: Date;
  documentId?: string;
}

export type DownloadFormat = 'pdf' | 'docx' | 'txt';

export interface ProcessedDocumentData {
  documentId?: string;
  title: string;
  fileName?: string;
  pageCount: number;
  originalText: string;
  cleanedText: string;
  artifactsRemoved: number;
  spacesFixed: number;
  lineBreaksFixed: number;
  ocrCorrectionsCount: number;
  readabilityScoreBefore: number;
  readabilityScoreAfter: number;
  cleanedAt: Date;
}

export interface DocumentContextType {
  uploadedFile: UploadedFileInfo | null;
  documentId: string | null;
  selectedOptions: string[];
  processingProgress: number;
  processingStage: string;
  selectedDownloadFormat: DownloadFormat;
  processedDocument: ProcessedDocumentData | null;
  isProcessing: boolean;
  uploadError: string | null;
  processingError: string | null;
  showDownloadSuccess: boolean;
  triggerDownloadSuccess: () => void;
  setUploadedFile: (file: File | null) => Promise<boolean> | boolean;
  removeUploadedFile: () => void;
  toggleOption: (id: string) => void;
  setSelectedOptions: (options: string[]) => void;
  setSelectedDownloadFormat: (format: DownloadFormat) => void;
  startProcessingSimulation: (onComplete?: () => void) => void;
  startRealProcessing: (onComplete?: () => void) => Promise<void>;
  downloadProcessedFile: (format?: DownloadFormat) => Promise<void>;
  resetWorkflow: () => void;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => { success: boolean; error?: string };
  signup: (name: string, email: string, password: string) => { success: boolean; error?: string };
  logout: () => void;
}
