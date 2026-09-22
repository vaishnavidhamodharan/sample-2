import fs from 'fs';
import path from 'path';

/**
 * Clean files older than maxAgeMs (default: 24 hours) in a directory
 */
export function cleanupOldFiles(dirPath: string, maxAgeMs = 24 * 60 * 60 * 1000): void {
  try {
    if (!fs.existsSync(dirPath)) return;
    const files = fs.readdirSync(dirPath);
    const now = Date.now();

    for (const file of files) {
      if (file === '.gitkeep') continue;
      const fullPath = path.join(dirPath, file);
      try {
        const stats = fs.statSync(fullPath);
        if (now - stats.mtimeMs > maxAgeMs) {
          fs.unlinkSync(fullPath);
        }
      } catch {
        // Ignore single file cleanup errors
      }
    }
  } catch (err) {
    console.error('Error during cleanup:', err);
  }
}
