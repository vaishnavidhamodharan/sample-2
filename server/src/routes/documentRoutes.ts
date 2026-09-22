import { Router, Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import {
  MAX_FILE_SIZE_BYTES,
  validateFileMetadata,
  sanitizeFileName,
} from '../utils/fileValidation';
import { DocumentProcessingService } from '../services/documentProcessingService';
import { DocumentExportService } from '../services/documentExportService';

const router = Router();

const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (_req, file, cb) => {
    const documentId = `doc_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const sanitized = sanitizeFileName(file.originalname);
    cb(null, `${documentId}_${sanitized}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: MAX_FILE_SIZE_BYTES },
  fileFilter: (_req, file, cb) => {
    const validation = validateFileMetadata(file.originalname, 0, file.mimetype);
    if (!validation.valid) {
      cb(new Error(validation.error || 'Invalid file.'));
    } else {
      cb(null, true);
    }
  },
});

/**
 * POST /api/documents/upload
 * Ingests a real document file
 */
router.post('/upload', upload.single('file'), async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ success: false, error: 'No document file uploaded.' });
      return;
    }

    const filename = req.file.filename;
    // Extract documentId from filename prefix: doc_12345_abc_originalName.ext
    const match = filename.match(/^(doc_\d+_[a-z0-9]+)_(.+)$/);
    const documentId = match ? match[1] : filename.split('_')[0];
    const originalName = match ? match[2] : req.file.originalname;
    const ext = originalName.split('.').pop() || '';

    res.json({
      success: true,
      documentId,
      fileName: originalName,
      fileType: ext.toUpperCase(),
      fileSize: req.file.size,
    });
  } catch (error) {
    console.error('Upload handling error:', error);
    res.status(500).json({ success: false, error: (error as Error).message || 'Failed to upload document.' });
  }
});

/**
 * POST /api/documents/:documentId/process
 * Runs real extraction and cleaning pipeline on uploaded file
 */
router.post('/:documentId/process', async (req: Request, res: Response): Promise<void> => {
  try {
    const { documentId } = req.params;
    const options: string[] = Array.isArray(req.body.options) ? req.body.options : [];

    if (!documentId) {
      res.status(400).json({ success: false, error: 'Missing documentId parameter.' });
      return;
    }

    const processedRecord = await DocumentProcessingService.processDocument(documentId, options);

    res.json({
      success: true,
      documentId: processedRecord.documentId,
      title: processedRecord.title,
      fileName: processedRecord.originalFileName,
      fileType: processedRecord.fileType,
      fileSize: processedRecord.fileSize,
      pageCount: processedRecord.pageCount,
      originalText: processedRecord.originalText,
      cleanedText: processedRecord.cleanedText,
      statistics: processedRecord.statistics,
    });
  } catch (error) {
    console.error('Processing handling error:', error);
    res.status(500).json({ success: false, error: (error as Error).message || 'Failed to process document.' });
  }
});

/**
 * GET /api/documents/:documentId
 * GET /api/documents/:documentId/preview
 * Returns document preview metadata and cleaned content
 */
const getDocumentPreview = async (req: Request, res: Response): Promise<void> => {
  try {
    const { documentId } = req.params;
    const record = await DocumentProcessingService.getProcessedDocument(documentId);

    if (!record) {
      res.status(404).json({
        success: false,
        error: 'Document is no longer available. Please upload and process it again.',
      });
      return;
    }

    res.json({
      success: true,
      documentId: record.documentId,
      title: record.title,
      fileName: record.originalFileName,
      fileType: record.fileType,
      fileSize: record.fileSize,
      pageCount: record.pageCount,
      originalText: record.originalText,
      cleanedText: record.cleanedText,
      statistics: record.statistics,
      processedAt: record.processedAt,
    });
  } catch (error) {
    console.error('Preview error:', error);
    res.status(500).json({ success: false, error: (error as Error).message });
  }
};

router.get('/:documentId', getDocumentPreview);
router.get('/:documentId/preview', getDocumentPreview);

/**
 * GET /api/documents/:documentId/download?format=pdf|docx|txt
 * Generates and downloads real cleaned file
 */
router.get('/:documentId/download', async (req: Request, res: Response): Promise<void> => {
  try {
    const { documentId } = req.params;
    const format = ((req.query.format as string) || 'pdf').toLowerCase();

    const record = await DocumentProcessingService.getProcessedDocument(documentId);

    if (!record) {
      res.status(404).json({
        success: false,
        error: 'Document is no longer available. Please upload and process it again.',
      });
      return;
    }

    const safeTitle = sanitizeFileName(record.title);

    if (format === 'txt') {
      const buffer = await DocumentExportService.generateTxt(record.cleanedText);
      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      res.setHeader('Content-Disposition', `attachment; filename="${safeTitle}_cleaned.txt"`);
      res.send(buffer);
    } else if (format === 'docx') {
      const buffer = await DocumentExportService.generateDocx(record.title, record.cleanedText);
      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      );
      res.setHeader('Content-Disposition', `attachment; filename="${safeTitle}_cleaned.docx"`);
      res.send(buffer);
    } else if (format === 'pdf') {
      const uint8 = await DocumentExportService.generatePdf(record.title, record.cleanedText);
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${safeTitle}_cleaned.pdf"`);
      res.send(Buffer.from(uint8));
    } else {
      res.status(400).json({ success: false, error: `Unsupported export format: ${format}` });
    }
  } catch (error) {
    console.error('Download generation error:', error);
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

export default router;
