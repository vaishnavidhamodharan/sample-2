export type DocumentLifecycleStatus =
  | 'Uploaded'
  | 'Verified'
  | 'Analyzing'
  | 'Cleaning'
  | 'Cleaned'
  | 'Downloaded';

export interface UserDocumentItem {
  id: string;
  fileName: string;
  fileType: string;
  fileSize: string;
  date: string;
  timestamp: number;
  status: DocumentLifecycleStatus;
  downloadAvailable?: boolean;
}

const getStorageKey = (email: string) => `docuclean_documents_${email.trim().toLowerCase()}`;

export const getUserDocuments = (email: string): UserDocumentItem[] => {
  if (!email) return [];
  try {
    const raw = localStorage.getItem(getStorageKey(email));
    if (raw) {
      return JSON.parse(raw) as UserDocumentItem[];
    }
  } catch {
    // ignore
  }
  return [];
};

export const upsertUserDocument = (
  email: string,
  doc: {
    id?: string;
    fileName: string;
    fileType: string;
    fileSize: string;
    date?: string;
    status: DocumentLifecycleStatus;
  }
): UserDocumentItem => {
  const nowFormatted =
    doc.date ||
    new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  if (!email) {
    return {
      id: doc.id || `doc_${Date.now()}`,
      fileName: doc.fileName,
      fileType: doc.fileType,
      fileSize: doc.fileSize,
      date: nowFormatted,
      timestamp: Date.now(),
      status: doc.status,
      downloadAvailable: doc.status === 'Cleaned' || doc.status === 'Downloaded',
    };
  }

  const existing = getUserDocuments(email);

  // Find matching document by ID or if matching fileName
  const matchIndex = existing.findIndex(
    (d) => (doc.id && d.id === doc.id) || d.fileName.toLowerCase() === doc.fileName.toLowerCase()
  );

  let targetItem: UserDocumentItem;

  if (matchIndex >= 0) {
    targetItem = {
      ...existing[matchIndex],
      status: doc.status,
      fileType: doc.fileType || existing[matchIndex].fileType,
      fileSize: doc.fileSize || existing[matchIndex].fileSize,
      date: nowFormatted,
      timestamp: Date.now(),
      downloadAvailable: doc.status === 'Cleaned' || doc.status === 'Downloaded',
    };
    const updated = [...existing];
    updated[matchIndex] = targetItem;
    try {
      localStorage.setItem(getStorageKey(email), JSON.stringify(updated));
    } catch {
      // ignore
    }
  } else {
    targetItem = {
      id: doc.id || `doc_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      fileName: doc.fileName,
      fileType: doc.fileType,
      fileSize: doc.fileSize,
      date: nowFormatted,
      timestamp: Date.now(),
      status: doc.status,
      downloadAvailable: doc.status === 'Cleaned' || doc.status === 'Downloaded',
    };
    const updated = [targetItem, ...existing];
    try {
      localStorage.setItem(getStorageKey(email), JSON.stringify(updated));
    } catch {
      // ignore
    }
  }

  return targetItem;
};

export const updateUserDocumentStatus = (
  email: string,
  identifier: string,
  status: DocumentLifecycleStatus
): UserDocumentItem | null => {
  if (!email || !identifier) return null;
  const existing = getUserDocuments(email);
  const index = existing.findIndex(
    (d) => d.id === identifier || d.fileName.toLowerCase() === identifier.toLowerCase()
  );
  if (index === -1) return null;

  const item = existing[index];
  item.status = status;
  item.downloadAvailable = status === 'Cleaned' || status === 'Downloaded';
  item.timestamp = Date.now();

  try {
    localStorage.setItem(getStorageKey(email), JSON.stringify(existing));
  } catch {
    // ignore
  }

  return item;
};

export const saveUserDocument = (
  email: string,
  doc: Omit<UserDocumentItem, 'id' | 'timestamp'>
): UserDocumentItem => {
  return upsertUserDocument(email, {
    fileName: doc.fileName,
    fileType: doc.fileType,
    fileSize: doc.fileSize,
    date: doc.date,
    status: doc.status,
  });
};

export const deleteUserDocument = (email: string, id: string): UserDocumentItem[] => {
  const existing = getUserDocuments(email);
  const updated = existing.filter((d) => d.id !== id);
  try {
    localStorage.setItem(getStorageKey(email), JSON.stringify(updated));
  } catch {
    // ignore
  }
  return updated;
};
