import path from 'path';

export const MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024; // 50MB

export const ALLOWED_EXTENSIONS = ['pdf', 'doc', 'docx', 'txt', 'png', 'jpg', 'jpeg'];

export const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain',
  'image/png',
  'image/jpeg',
  'image/jpg',
  'application/octet-stream', // Some browsers send octet-stream for docx/doc
];

export function sanitizeFileName(name: string): string {
  // Strip path traversal and dangerous characters
  const base = path.basename(name);
  return base.replace(/[^a-zA-Z0-9._\- ]/g, '_');
}

export function validateFileMetadata(fileName: string, fileSize: number, mimeType?: string): { valid: boolean; error?: string } {
  if (!fileName) {
    return { valid: false, error: 'File name is missing.' };
  }

  if (fileSize > MAX_FILE_SIZE_BYTES) {
    return { valid: false, error: 'File size exceeds maximum supported limit of 50 MB.' };
  }

  const ext = fileName.split('.').pop()?.toLowerCase();
  if (!ext || !ALLOWED_EXTENSIONS.includes(ext)) {
    return { valid: false, error: `Unsupported file type (.${ext || 'unknown'}). Supported formats: ${ALLOWED_EXTENSIONS.join(', ').toUpperCase()}` };
  }

  return { valid: true };
}
