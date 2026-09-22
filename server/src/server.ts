import express from 'express';
import cors from 'cors';
import documentRoutes from './routes/documentRoutes';
import { cleanupOldFiles } from './utils/cleanup';
import path from 'path';

export const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'DocuClean AI Document Processing Engine',
  });
});

// Document processing routes
app.use('/api/documents', documentRoutes);

// Daily cleanup of uploads older than 24h
const uploadsDir = path.join(process.cwd(), 'uploads');
const processedDir = path.join(process.cwd(), 'processed');
cleanupOldFiles(uploadsDir);
cleanupOldFiles(processedDir);
setInterval(() => {
  cleanupOldFiles(uploadsDir);
  cleanupOldFiles(processedDir);
}, 60 * 60 * 1000);

// Global Error Handler
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Unhandled server error:', err);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal server error occurred during processing.',
  });
});

// Standalone execution support
const isMain = process.argv[1]?.includes('server/src/server.ts');
if (isMain) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`DocuClean AI Backend running on port ${PORT}`);
  });
}

export default app;
