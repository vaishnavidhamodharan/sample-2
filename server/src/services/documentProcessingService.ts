import fs from 'fs';
import path from 'path';
import { PDFParse } from 'pdf-parse';
import mammoth from 'mammoth';
import { OCRService } from './ocrService';
import { TextCleaningService, CleaningStatistics } from './textCleaningService';

export interface ProcessedDocumentRecord {
  documentId: string;
  title: string;
  originalFileName: string;
  fileType: string;
  fileSize: number;
  originalText: string;
  cleanedText: string;
  statistics: CleaningStatistics;
  pageCount: number;
  selectedOptions: string[];
  processedAt: string;
}

export class DocumentProcessingService {
  private static uploadsDir = path.join(process.cwd(), 'uploads');
  private static processedDir = path.join(process.cwd(), 'processed');

  private static ensureDirs(): void {
    if (!fs.existsSync(this.uploadsDir)) {
      fs.mkdirSync(this.uploadsDir, { recursive: true });
    }
    if (!fs.existsSync(this.processedDir)) {
      fs.mkdirSync(this.processedDir, { recursive: true });
    }
  }

  /**
   * Extract raw text from the uploaded document based on file type.
   */
  public static async extractRawText(filePath: string, extension: string): Promise<{ text: string; pageCount: number }> {
    const ext = extension.toLowerCase().replace(/^\./, '');
    let extractedText = '';
    let pageCount = 1;

    if (ext === 'txt') {
      extractedText = await fs.promises.readFile(filePath, 'utf-8');
      pageCount = Math.max(1, Math.ceil(extractedText.split(/\r?\n/).length / 45));
    } else if (ext === 'docx' || ext === 'doc') {
      try {
        const result = await mammoth.extractRawText({ path: filePath });
        extractedText = result.value || '';
        pageCount = Math.max(1, Math.ceil(extractedText.split(/\r?\n/).length / 40));
      } catch (docErr) {
        console.error('Mammoth extraction failed:', docErr);
        throw new Error(`Failed to extract text from Word document: ${(docErr as Error).message}`);
      }
    } else if (ext === 'pdf') {
      try {
        const dataBuffer = await fs.promises.readFile(filePath);
        const parser = new PDFParse({ data: dataBuffer });
        const pdfData = await parser.getText();
        extractedText = pdfData.text || '';
        pageCount = pdfData.total || 1;
        await parser.destroy();

        // If PDF text is suspiciously empty or contains almost no letters (e.g. scanned image PDF)
        if (extractedText.trim().replace(/[^a-zA-Z0-9]/g, '').length < 25) {
          // Attempt OCR fallback on the buffer
          try {
            console.log('PDF text is sparse or empty, trying OCR extraction...');
            const ocrResult = await OCRService.recognizeImage(dataBuffer);
            if (ocrResult && ocrResult.trim().length > 10) {
              extractedText = ocrResult;
            }
          } catch (ocrPdfErr) {
            console.warn('OCR fallback on PDF buffer failed:', ocrPdfErr);
          }
        }
      } catch (pdfErr) {
        console.error('PDF parsing error:', pdfErr);
        throw new Error(`Failed to parse PDF document: ${(pdfErr as Error).message}`);
      }
    } else if (['png', 'jpg', 'jpeg'].includes(ext)) {
      try {
        extractedText = await OCRService.recognizeImage(filePath);
        pageCount = 1;
      } catch (imgErr) {
        console.error('Image OCR error:', imgErr);
        throw new Error(`Failed to read image text: ${(imgErr as Error).message}`);
      }
    } else {
      throw new Error(`Unsupported document extension: .${ext}`);
    }

    return {
      text: extractedText,
      pageCount: Math.max(1, pageCount),
    };
  }

  /**
   * Process an uploaded document by documentId and options.
   */
  public static async processDocument(
    documentId: string,
    options: string[]
  ): Promise<ProcessedDocumentRecord> {
    this.ensureDirs();

    // Find the uploaded file in uploads dir
    const uploadFiles = await fs.promises.readdir(this.uploadsDir);
    const targetFile = uploadFiles.find((f) => f.startsWith(`${documentId}_`));

    if (!targetFile) {
      throw new Error('Document is no longer available. Please upload and process it again.');
    }

    const filePath = path.join(this.uploadsDir, targetFile);
    const originalFileName = targetFile.replace(`${documentId}_`, '');
    const extension = originalFileName.split('.').pop() || 'txt';
    const stats = await fs.promises.stat(filePath);

    // 1. Extract raw text from the real file
    const { text: rawText, pageCount } = await this.extractRawText(filePath, extension);

    // 2. Clean the extracted text using deterministic + AI engine
    const { cleanedText, statistics } = await TextCleaningService.cleanDocumentText(rawText, options);

    const title = originalFileName.replace(/\.[^/.]+$/, '');

    const record: ProcessedDocumentRecord = {
      documentId,
      title,
      originalFileName,
      fileType: extension.toUpperCase(),
      fileSize: stats.size,
      originalText: rawText,
      cleanedText,
      statistics,
      pageCount,
      selectedOptions: options,
      processedAt: new Date().toISOString(),
    };

    // 3. Save the processed record to disk
    const processedFilePath = path.join(this.processedDir, `${documentId}.json`);
    await fs.promises.writeFile(processedFilePath, JSON.stringify(record, null, 2), 'utf-8');

    return record;
  }

  /**
   * Retrieve a processed document record by documentId.
   */
  public static async getProcessedDocument(documentId: string): Promise<ProcessedDocumentRecord | null> {
    this.ensureDirs();
    const processedFilePath = path.join(this.processedDir, `${documentId}.json`);
    if (!fs.existsSync(processedFilePath)) {
      return null;
    }
    const data = await fs.promises.readFile(processedFilePath, 'utf-8');
    return JSON.parse(data) as ProcessedDocumentRecord;
  }
}
