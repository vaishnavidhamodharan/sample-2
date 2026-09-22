import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  getUserDocuments,
  deleteUserDocument,
  StoredUserDocument,
} from '../services/documentStorage';
import {
  FileText,
  Trash2,
  Download,
  UploadCloud,
  CheckCircle2,
  Clock,
  HardDrive,
  Search,
} from 'lucide-react';
import { Button } from '../components/Button';

export const Documents: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [documents, setDocuments] = useState<StoredUserDocument[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (user?.email) {
      setDocuments(getUserDocuments(user.email));
    }
  }, [user]);

  const handleDelete = (id: string) => {
    if (!user?.email) return;
    deleteUserDocument(user.email, id);
    setDocuments((prev) => prev.filter((doc) => doc.id !== id));
  };

  const filteredDocs = documents.filter((doc) =>
    doc.fileName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6 w-full max-w-5xl mx-auto select-none pt-2">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#EADCC8]">
        <div>
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#3C8D87] block mb-1">
            Vault
          </span>
          <h1 className="font-heading font-black text-2xl sm:text-3xl text-[#24162F] tracking-tight">
            My Restored Documents
          </h1>
          <p className="text-xs sm:text-sm text-[#6F6670] mt-1">
            Access your processed document records and previously exported files.
          </p>
        </div>

        <Link to="/upload">
          <Button
            size="md"
            leftIcon={<UploadCloud className="w-4 h-4 text-[#A8D5C2]" />}
            className="font-extrabold"
          >
            Clean New File
          </Button>
        </Link>
      </div>

      {/* Filter / Search Bar */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative w-full max-w-sm">
          <Search className="w-4 h-4 text-[#978D91] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by filename..."
            className="w-full h-10 pl-10 pr-4 rounded-xl bg-white border border-[#EADCC8] focus:border-[#6B315E] focus:outline-hidden text-xs text-[#2C2830]"
          />
        </div>

        <span className="text-xs font-mono text-[#6F6670] font-semibold">
          {filteredDocs.length} {filteredDocs.length === 1 ? 'file' : 'files'}
        </span>
      </div>

      {/* Documents List */}
      {filteredDocs.length === 0 ? (
        <div className="p-12 rounded-3xl bg-[#FFF8ED] border border-[#EADCC8] text-center flex flex-col items-center justify-center">
          <div className="w-12 h-12 rounded-2xl bg-[#EADCC8]/60 text-[#6F6670] flex items-center justify-center mb-3">
            <HardDrive className="w-6 h-6" />
          </div>
          <h3 className="font-heading font-bold text-base text-[#24162F] mb-1">
            No Documents Found
          </h3>
          <p className="text-xs text-[#6F6670] max-w-sm mb-6">
            Upload your first degraded PDF, scan, or Word file to begin processing.
          </p>
          <Link to="/upload">
            <Button size="md" leftIcon={<UploadCloud className="w-4 h-4" />}>
              Upload Document
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {filteredDocs.map((doc) => (
            <div
              key={doc.id}
              className="p-4 sm:p-5 rounded-2xl bg-[#FFF8ED] border border-[#6B315E]/15 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:shadow-sm transition-shadow"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#6B315E] to-[#24162F] text-white flex items-center justify-center font-bold font-mono text-xs shadow-2xs">
                  {doc.fileType}
                </div>
                <div>
                  <h4 className="font-heading font-bold text-sm sm:text-base text-[#2C2830] truncate max-w-[260px] sm:max-w-md">
                    {doc.fileName}
                  </h4>
                  <div className="flex items-center gap-3 mt-0.5 text-[11px] font-mono text-[#6F6670]">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[#978D91]" />
                      {doc.date}
                    </span>
                    <span>•</span>
                    <span>{doc.fileSize}</span>
                    <span>•</span>
                    <span className="text-[#3C8D87] font-bold flex items-center gap-0.5">
                      <CheckCircle2 className="w-3 h-3" />
                      {doc.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 self-end sm:self-center">
                <button
                  type="button"
                  onClick={() => handleDelete(doc.id)}
                  title="Remove from history"
                  className="p-2 rounded-xl text-[#6F6670] hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
