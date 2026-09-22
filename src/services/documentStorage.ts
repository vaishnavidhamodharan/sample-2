export interface StoredUserDocument {
  id: string;
  fileName: string;
  fileType: string;
  fileSize: string;
  date: string;
  status: string;
  timestamp: number;
}

const STORAGE_PREFIX = 'docclean_docs_';

export function getUserDocuments(userEmail: string): StoredUserDocument[] {
  if (!userEmail) return [];
  try {
    const raw = localStorage.getItem(`${STORAGE_PREFIX}${userEmail.toLowerCase()}`);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (err) {
    console.warn('Failed to load user documents:', err);
  }

  // Initial demo documents if empty
  const defaultDocs: StoredUserDocument[] = [
    {
      id: 'doc_init_1',
      fileName: 'Quarterly_Audit_Report_2024.pdf',
      fileType: 'PDF',
      fileSize: '1.8 MB',
      date: 'Sep 21, 2026',
      status: 'Cleaned',
      timestamp: Date.now() - 86400000,
    },
    {
      id: 'doc_init_2',
      fileName: 'Vendor_Reconciliation_Ledger.docx',
      fileType: 'DOCX',
      fileSize: '640 KB',
      date: 'Sep 20, 2026',
      status: 'Cleaned',
      timestamp: Date.now() - 172800000,
    },
  ];

  try {
    localStorage.setItem(`${STORAGE_PREFIX}${userEmail.toLowerCase()}`, JSON.stringify(defaultDocs));
  } catch {
    // ignore
  }

  return defaultDocs;
}

export function saveUserDocument(
  userEmail: string,
  doc: Omit<StoredUserDocument, 'id' | 'timestamp'> & { id?: string }
): StoredUserDocument {
  if (!userEmail) throw new Error('User email required to store document record');

  const existing = getUserDocuments(userEmail);
  const newRecord: StoredUserDocument = {
    id: doc.id || `doc_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    fileName: doc.fileName,
    fileType: doc.fileType || 'PDF',
    fileSize: doc.fileSize || '1.0 MB',
    date: doc.date || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    status: doc.status || 'Downloaded',
    timestamp: Date.now(),
  };

  const updated = [newRecord, ...existing.filter((d) => d.fileName !== newRecord.fileName && d.id !== newRecord.id)];
  try {
    localStorage.setItem(`${STORAGE_PREFIX}${userEmail.toLowerCase()}`, JSON.stringify(updated));
  } catch (err) {
    console.warn('Failed to save document:', err);
  }

  return newRecord;
}

export function upsertUserDocument(
  userEmail: string,
  doc: Partial<StoredUserDocument> & { fileName: string }
): StoredUserDocument {
  if (!userEmail) throw new Error('User email required');

  const existing = getUserDocuments(userEmail);
  const matchIndex = existing.findIndex((d) => d.fileName.toLowerCase() === doc.fileName.toLowerCase());

  const record: StoredUserDocument = {
    id: doc.id || (matchIndex >= 0 ? existing[matchIndex].id : `doc_${Date.now()}`),
    fileName: doc.fileName,
    fileType: doc.fileType || (matchIndex >= 0 ? existing[matchIndex].fileType : 'PDF'),
    fileSize: doc.fileSize || (matchIndex >= 0 ? existing[matchIndex].fileSize : 'Unknown'),
    date: doc.date || (matchIndex >= 0 ? existing[matchIndex].date : new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })),
    status: doc.status || (matchIndex >= 0 ? existing[matchIndex].status : 'Uploaded'),
    timestamp: Date.now(),
  };

  const updated = matchIndex >= 0
    ? existing.map((item, idx) => (idx === matchIndex ? record : item))
    : [record, ...existing];

  try {
    localStorage.setItem(`${STORAGE_PREFIX}${userEmail.toLowerCase()}`, JSON.stringify(updated));
  } catch (err) {
    console.warn('Failed to upsert document:', err);
  }

  return record;
}

export function updateUserDocumentStatus(
  userEmail: string,
  fileName: string,
  status: string
): void {
  if (!userEmail || !fileName) return;
  const existing = getUserDocuments(userEmail);
  const updated = existing.map((doc) => {
    if (doc.fileName.toLowerCase() === fileName.toLowerCase()) {
      return { ...doc, status, timestamp: Date.now() };
    }
    return doc;
  });

  try {
    localStorage.setItem(`${STORAGE_PREFIX}${userEmail.toLowerCase()}`, JSON.stringify(updated));
  } catch (err) {
    console.warn('Failed to update document status:', err);
  }
}

export function deleteUserDocument(userEmail: string, docId: string): void {
  if (!userEmail) return;
  const existing = getUserDocuments(userEmail);
  const updated = existing.filter((d) => d.id !== docId);
  try {
    localStorage.setItem(`${STORAGE_PREFIX}${userEmail.toLowerCase()}`, JSON.stringify(updated));
  } catch {
    // ignore
  }
}
