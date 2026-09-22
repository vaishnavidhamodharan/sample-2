import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText,
  Clock,
  Sparkles,
  Download,
  Trash2,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  FileCheck2,
  Lock,
  UploadCloud,
  Layers,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import {
  getUserDocuments,
  deleteUserDocument,
  updateUserDocumentStatus,
  UserDocumentItem,
  DocumentLifecycleStatus,
} from '../services/documentStorage';
import { Button } from '../components/Button';

export const Documents: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [documents, setDocuments] = useState<UserDocumentItem[]>([]);
  const [downloadNotification, setDownloadNotification] = useState<string | null>(null);

  useEffect(() => {
    if (user?.email) {
      setDocuments(getUserDocuments(user.email));
    } else {
      setDocuments([]);
    }
  }, [user]);

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user?.email) return;
    const updated = deleteUserDocument(user.email, id);
    setDocuments(updated);
  };

  const handleDownload = (doc: UserDocumentItem, e: React.MouseEvent) => {
    e.stopPropagation();
    // Trigger download of restored document
    const element = document.createElement('a');
    const file = new Blob(
      [
        `Restored & Cleaned Content for ${doc.fileName}\n` +
        `Format: ${doc.fileType}\n` +
        `Status: Downloaded\n` +
        `Date: ${doc.date}\n` +
        `Engine: DocuClean AI 2.0 Optical Reconstructor\n`
      ],
      { type: 'text/plain' }
    );
    element.href = URL.createObjectURL(file);
    element.download = doc.fileName;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);

    if (user?.email) {
      updateUserDocumentStatus(user.email, doc.id, 'Downloaded');
      setDocuments(getUserDocuments(user.email));
    }

    setDownloadNotification(`Downloaded ${doc.fileName}`);
    setTimeout(() => setDownloadNotification(null), 2500);
  };

  const renderStatusBadge = (status: DocumentLifecycleStatus) => {
    switch (status) {
      case 'Uploaded':
        return (
          <span className="px-2.5 py-1 rounded-full bg-[#EADCC8] border border-[#6B315E]/20 text-[#6B315E] text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#6B315E]" />
            Uploaded
          </span>
        );
      case 'Verified':
        return (
          <span className="px-2.5 py-1 rounded-full bg-[#3C8D87]/15 border border-[#3C8D87]/30 text-[#3C8D87] text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-[#3C8D87]" />
            Verified
          </span>
        );
      case 'Analyzing':
        return (
          <span className="px-2.5 py-1 rounded-full bg-[#6B315E]/15 border border-[#6B315E]/30 text-[#6B315E] text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#6B315E] animate-ping" />
            Analyzing
          </span>
        );
      case 'Cleaning':
        return (
          <span className="px-2.5 py-1 rounded-full bg-[#C65D45]/15 border border-[#C65D45]/30 text-[#C65D45] text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C65D45] animate-ping" />
            Cleaning
          </span>
        );
      case 'Cleaned':
        return (
          <span className="px-2.5 py-1 rounded-full bg-[#A8D5C2]/35 border border-[#3C8D87]/40 text-[#24162F] text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-[#3C8D87]" />
            Cleaned
          </span>
        );
      case 'Downloaded':
        return (
          <span className="px-2.5 py-1 rounded-full bg-[#3C8D87]/20 border border-[#3C8D87]/50 text-[#3C8D87] text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-1">
            <Download className="w-3 h-3 text-[#3C8D87]" />
            Downloaded
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 rounded-full bg-[#EADCC8]/60 text-[#6F6670] text-[10px] font-mono font-bold uppercase">
            {status}
          </span>
        );
    }
  };

  // 1. Not Authenticated Fallback (guarded also by ProtectedRoute)
  if (!isAuthenticated || !user) {
    return (
      <div className="w-full max-w-xl mx-auto my-auto py-12 text-center animate-in fade-in duration-300">
        <div className="bg-[#FFF8ED]/95 backdrop-blur-xl border border-[#6B315E]/20 rounded-3xl p-8 sm:p-12 shadow-xl flex flex-col items-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#24162F] via-[#6B315E] to-[#C65D45] flex items-center justify-center text-[#FFF8ED] shadow-lg mb-6">
            <Lock className="w-8 h-8 text-[#A8D5C2]" />
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#24162F] font-heading tracking-tight mb-2">
            Sign In to View Your Documents
          </h2>
          <p className="text-sm text-[#6F6670] max-w-md mx-auto mb-8 font-body">
            Your cleaned and enhanced documents are securely stored in your personal account history.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full justify-center">
            <Button
              size="lg"
              onClick={() => navigate('/signin', { state: { from: '/documents' } })}
              rightIcon={<ArrowRight className="w-4 h-4 ml-1" />}
              className="w-full sm:w-auto"
            >
              Sign In
            </Button>
            <Button
              variant="secondary"
              size="lg"
              onClick={() => navigate('/signup', { state: { from: '/documents' } })}
              className="w-full sm:w-auto"
            >
              Create Account
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // 2. Authenticated Personal Archive View
  return (
    <div className="w-full max-w-5xl mx-auto py-6 sm:py-8 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-[#EADCC8]">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EADCC8]/40 border border-[#6B315E]/15 text-xs font-mono text-[#6B315E] mb-2 font-bold">
            <Sparkles className="w-3.5 h-3.5 text-[#C65D45]" />
            <span>PERSONAL ARCHIVE</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#24162F] font-heading tracking-tight">
            My Documents
          </h1>
          <p className="text-xs sm:text-sm text-[#6F6670] mt-1 font-body">
            Document history for <span className="font-bold text-[#24162F]">{user.name}</span> ({user.email})
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate('/upload')}
          className="primary-btn text-[#FFF8ED] px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-lg cursor-pointer self-start sm:self-auto"
        >
          <UploadCloud className="w-4 h-4 text-[#A8D5C2]" />
          <span>Upload Document</span>
        </button>
      </div>

      {/* Notification Toast */}
      {downloadNotification && (
        <div className="mb-6 p-3 rounded-xl bg-[#A8D5C2]/40 border border-[#3C8D87]/40 text-[#24162F] text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-[#3C8D87]" />
          <span>{downloadNotification}</span>
        </div>
      )}

      {/* Documents List or Empty State */}
      {documents.length === 0 ? (
        /* Empty State */
        <div className="bg-[#FFF8ED]/90 backdrop-blur-xl border border-[#6B315E]/20 rounded-3xl p-10 sm:p-16 text-center shadow-xl flex flex-col items-center justify-center">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-[#FFF8ED] to-[#EADCC8] border border-[#6B315E]/20 flex items-center justify-center text-[#6B315E] shadow-inner mb-6 relative">
            <FileText className="w-10 h-10 text-[#6B315E]" />
            <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-[#3C8D87] text-[#FFF8ED] flex items-center justify-center shadow-md">
              <Sparkles className="w-4 h-4 text-[#A8D5C2]" />
            </div>
          </div>

          <h2 className="text-xl sm:text-2xl font-extrabold text-[#24162F] font-heading tracking-tight mb-2">
            No documents yet
          </h2>
          <p className="text-xs sm:text-sm text-[#6F6670] max-w-sm mb-6 font-body">
            Upload a document to start cleaning.
          </p>

          <Button
            size="md"
            onClick={() => navigate('/upload')}
            rightIcon={<ArrowRight className="w-4 h-4 ml-1" />}
          >
            Upload Document
          </Button>
        </div>
      ) : (
        /* Documents Grid / Cards */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {documents.map((doc) => {
            const isDownloadable = doc.status === 'Cleaned' || doc.status === 'Downloaded' || doc.downloadAvailable;
            return (
              <div
                key={doc.id}
                className="bg-[#FFF8ED]/95 backdrop-blur-xl border border-[#6B315E]/20 hover:border-[#6B315E]/40 rounded-2xl p-5 shadow-md hover:shadow-xl transition-all flex flex-col justify-between group"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#24162F] via-[#6B315E] to-[#C65D45] flex items-center justify-center text-[#FFF8ED] shadow-sm flex-shrink-0">
                      <FileCheck2 className="w-6 h-6 text-[#A8D5C2]" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3
                        className="text-sm sm:text-base font-bold text-[#24162F] font-heading truncate group-hover:text-[#6B315E] transition-colors"
                        title={doc.fileName}
                      >
                        {doc.fileName}
                      </h3>

                      <div className="flex flex-wrap items-center gap-2 mt-1 text-[11px] text-[#6F6670]">
                        <span className="font-mono px-2 py-0.5 rounded bg-[#EADCC8]/60 text-[#24162F] font-semibold uppercase text-[10px]">
                          {doc.fileType}
                        </span>
                        <span>•</span>
                        <span>{doc.fileSize}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-[#978D91]" />
                          {doc.date}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex-shrink-0">
                    {renderStatusBadge(doc.status)}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-[#EADCC8] flex items-center justify-between">
                  <span className="text-[11px] text-[#978D91] flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#3C8D87]" />
                    <span>Optical OCR 2.0</span>
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={(e) => handleDelete(doc.id, e)}
                      title="Remove from history"
                      className="p-1.5 rounded-lg text-[#978D91] hover:text-[#C65D45] hover:bg-[#E98268]/15 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    {isDownloadable ? (
                      <button
                        type="button"
                        onClick={(e) => handleDownload(doc, e)}
                        title="Download cleaned document"
                        className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#6B315E]/10 hover:bg-[#6B315E] text-[#6B315E] hover:text-[#FFF8ED] text-xs font-bold transition-all cursor-pointer shadow-xs"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => navigate('/upload')}
                        title="Continue processing in chamber"
                        className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#3C8D87]/15 hover:bg-[#3C8D87] text-[#3C8D87] hover:text-[#FFF8ED] text-xs font-bold transition-all cursor-pointer shadow-xs"
                      >
                        <Layers className="w-3.5 h-3.5" />
                        <span>Open Chamber</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
