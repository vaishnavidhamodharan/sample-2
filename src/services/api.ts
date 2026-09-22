import { ProcessedDocumentData } from '../types';

const API_BASE = (import.meta as any).env?.VITE_API_BASE_URL || '/api';

export interface UploadResponse {
  success: boolean;
  documentId: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  error?: string;
}

export interface ProcessApiResponse {
  success: boolean;
  documentId: string;
  title: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  pageCount: number;
  originalText: string;
  cleanedText: string;
  statistics: {
    artifactsRemoved: number;
    spacesFixed: number;
    lineBreaksFixed: number;
    ocrCorrectionsCount: number;
    readabilityScoreBefore: number;
    readabilityScoreAfter: number;
  };
  error?: string;
}

/**
 * Upload a document file to the backend
 */
export async function uploadDocumentApi(file: File): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch(`${API_BASE}/documents/upload`, {
    method: 'POST',
    body: formData,
  });

  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.error || 'Failed to upload document to server.');
  }

  return data;
}

/**
 * Trigger backend processing for an uploaded document
 */
export async function processDocumentApi(
  documentId: string,
  options: string[]
): Promise<ProcessedDocumentData> {
  const res = await fetch(`${API_BASE}/documents/${documentId}/process`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ options }),
  });

  const data: ProcessApiResponse = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.error || 'Failed to process document.');
  }

  return {
    documentId: data.documentId,
    title: data.title,
    fileName: data.fileName,
    pageCount: data.pageCount || 1,
    originalText: data.originalText,
    cleanedText: data.cleanedText,
    artifactsRemoved: data.statistics.artifactsRemoved,
    spacesFixed: data.statistics.spacesFixed,
    lineBreaksFixed: data.statistics.lineBreaksFixed,
    ocrCorrectionsCount: data.statistics.ocrCorrectionsCount,
    readabilityScoreBefore: data.statistics.readabilityScoreBefore,
    readabilityScoreAfter: data.statistics.readabilityScoreAfter,
    cleanedAt: new Date(),
  };
}

/**
 * Get processed document preview from backend
 */
export async function getDocumentPreviewApi(documentId: string): Promise<ProcessedDocumentData> {
  const res = await fetch(`${API_BASE}/documents/${documentId}/preview`);
  const data = await res.json();

  if (!res.ok || !data.success) {
    throw new Error(data.error || 'Document is no longer available. Please upload and process it again.');
  }

  return {
    documentId: data.documentId,
    title: data.title,
    fileName: data.fileName,
    pageCount: data.pageCount || 1,
    originalText: data.originalText,
    cleanedText: data.cleanedText,
    artifactsRemoved: data.statistics.artifactsRemoved,
    spacesFixed: data.statistics.spacesFixed,
    lineBreaksFixed: data.statistics.lineBreaksFixed,
    ocrCorrectionsCount: data.statistics.ocrCorrectionsCount,
    readabilityScoreBefore: data.statistics.readabilityScoreBefore,
    readabilityScoreAfter: data.statistics.readabilityScoreAfter,
    cleanedAt: new Date(data.processedAt || Date.now()),
  };
}

/**
 * Trigger real browser download of cleaned document from backend
 */
export async function downloadCleanedDocumentApi(
  documentId: string,
  format: string,
  suggestedName?: string
): Promise<void> {
  const downloadUrl = `${API_BASE}/documents/${documentId}/download?format=${encodeURIComponent(format.toLowerCase())}`;
  
  const res = await fetch(downloadUrl);
  if (!res.ok) {
    let errorMsg = 'Failed to download document.';
    try {
      const errData = await res.json();
      errorMsg = errData.error || errorMsg;
    } catch {
      // ignore
    }
    throw new Error(errorMsg);
  }

  const blob = await res.blob();
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;

  // Check Content-Disposition header for filename if available
  const disposition = res.headers.get('content-disposition');
  let filename = suggestedName || `cleaned_document.${format}`;
  if (disposition && disposition.includes('filename=')) {
    const filenameMatch = disposition.match(/filename="?([^"]+)"?/);
    if (filenameMatch && filenameMatch[1]) {
      filename = filenameMatch[1];
    }
  }

  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}
