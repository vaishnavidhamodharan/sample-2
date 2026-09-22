import { createWorker } from 'tesseract.js';

export class OCRService {
  /**
   * Run OCR on an image file path or Buffer using Tesseract.js
   */
  public static async recognizeImage(imageInput: string | Buffer): Promise<string> {
    const worker = await createWorker('eng');
    try {
      const ret = await worker.recognize(imageInput);
      await worker.terminate();
      return ret.data.text || '';
    } catch (error) {
      try {
        await worker.terminate();
      } catch {
        // ignore terminate errors
      }
      console.error('OCR processing error:', error);
      throw new Error(`Failed to extract text via OCR: ${(error as Error).message}`);
    }
  }
}
