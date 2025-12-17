import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const getDocuments = createAsyncThunk('documentVault/getDocuments', async () => {
  const response = await axios.get('/api/documents/vault');
  return response.data;
});

export const uploadDocument = createAsyncThunk('documentVault/uploadDocument', async (fileData) => {
  const response = await axios.post('/api/documents/upload', fileData);
  return response.data;
});

export const shareDocument = createAsyncThunk('documentVault/shareDocument', async ({ documentId, shareData }) => {
  const response = await axios.post(`/api/documents/${documentId}/share`, shareData);
  return response.data;
});

const initialState = {
  documents: [
    {
      id: '1',
      name: 'last-will-v3-signed.pdf',
      category: 'Wills & Trusts',
      status: 'completed',
      sizeBytes: 2400000,
      mimeType: 'application/pdf',
      sharedBy: 'Sarah M',
      createdAt: '2025-06-12T10:30:00Z'
    },
    {
      id: '2',
      name: 'poa-financial-2024.pdf',
      category: 'Powers of Attorney',
      status: 'in_progress',
      sizeBytes: 1100000,
      mimeType: 'application/pdf',
      sharedBy: 'John D',
      createdAt: '2025-05-03T14:20:00Z'
    },
    {
      id: '3',
      name: 'healthcare-directive-draft.docx',
      category: 'Healthcare & Medical',
      status: 'pending_review',
      sizeBytes: 640000,
      mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      sharedBy: 'Muhammad S',
      createdAt: '2025-04-21T09:15:00Z'
    },
    {
      id: '4',
      name: 'home-title-main-residence.pdf',
      category: 'Property & Deeds',
      status: 'completed',
      sizeBytes: 3800000,
      mimeType: 'application/pdf',
      sharedBy: 'Sarah M',
      createdAt: '2025-03-09T16:45:00Z'
    },
    {
      id: '5',
      name: 'letter-to-family-legacy.md',
      category: 'Personal Letters',
      status: 'completed',
      sizeBytes: 84000,
      mimeType: 'text/markdown',
      sharedBy: 'Muhammad S',
      createdAt: '2025-01-01T12:00:00Z'
    },
    {
      id: '6',
      name: 'trust-fund-agreement.pdf',
      category: 'Wills & Trusts',
      status: 'completed',
      sizeBytes: 1800000,
      mimeType: 'application/pdf',
      sharedBy: 'Sarah M',
      createdAt: '2025-05-15T11:00:00Z'
    },
    {
      id: '7',
      name: 'poa-medical-2024.pdf',
      category: 'Powers of Attorney',
      status: 'completed',
      sizeBytes: 950000,
      mimeType: 'application/pdf',
      sharedBy: 'John D',
      createdAt: '2025-04-10T13:30:00Z'
    },
    {
      id: '8',
      name: 'living-will-final.pdf',
      category: 'Healthcare & Medical',
      status: 'completed',
      sizeBytes: 720000,
      mimeType: 'application/pdf',
      sharedBy: 'Muhammad S',
      createdAt: '2025-03-28T09:45:00Z'
    },
    {
      id: '9',
      name: 'vacation-home-deed.pdf',
      category: 'Property & Deeds',
      status: 'completed',
      sizeBytes: 2900000,
      mimeType: 'application/pdf',
      sharedBy: 'Sarah M',
      createdAt: '2025-02-14T14:20:00Z'
    },
    {
      id: '10',
      name: 'estate-planning-letter.pdf',
      category: 'Personal Letters',
      status: 'completed',
      sizeBytes: 156000,
      mimeType: 'application/pdf',
      sharedBy: 'Muhammad S',
      createdAt: '2025-01-15T10:15:00Z'
    },
    {
      id: '11',
      name: 'codicil-to-will.pdf',
      category: 'Wills & Trusts',
      status: 'in_progress',
      sizeBytes: 850000,
      mimeType: 'application/pdf',
      sharedBy: 'Sarah M',
      createdAt: '2025-06-01T16:00:00Z'
    },
    {
      id: '12',
      name: 'poa-property-2024.pdf',
      category: 'Powers of Attorney',
      status: 'pending_review',
      sizeBytes: 1200000,
      mimeType: 'application/pdf',
      sharedBy: 'John D',
      createdAt: '2025-05-20T12:10:00Z'
    },
    {
      id: '13',
      name: 'durable-power-of-attorney.pdf',
      category: 'Powers of Attorney',
      status: 'completed',
      sizeBytes: 1100000,
      mimeType: 'application/pdf',
      sharedBy: 'John D',
      createdAt: '2025-04-05T15:25:00Z'
    },
    {
      id: '14',
      name: 'hipaa-authorization.docx',
      category: 'Healthcare & Medical',
      status: 'completed',
      sizeBytes: 450000,
      mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      sharedBy: 'Muhammad S',
      createdAt: '2025-03-12T11:50:00Z'
    },
    {
      id: '15',
      name: 'commercial-property-deed.pdf',
      category: 'Property & Deeds',
      status: 'in_progress',
      sizeBytes: 4200000,
      mimeType: 'application/pdf',
      sharedBy: 'Sarah M',
      createdAt: '2025-05-08T13:40:00Z'
    },
    {
      id: '16',
      name: 'letter-to-executors.pdf',
      category: 'Personal Letters',
      status: 'completed',
      sizeBytes: 98000,
      mimeType: 'application/pdf',
      sharedBy: 'Muhammad S',
      createdAt: '2025-02-01T09:30:00Z'
    },
    {
      id: '17',
      name: 'revocable-trust-agreement.pdf',
      category: 'Wills & Trusts',
      status: 'completed',
      sizeBytes: 3100000,
      mimeType: 'application/pdf',
      sharedBy: 'Sarah M',
      createdAt: '2025-04-18T10:20:00Z'
    },
    {
      id: '18',
      name: 'special-power-of-attorney.pdf',
      category: 'Powers of Attorney',
      status: 'completed',
      sizeBytes: 780000,
      mimeType: 'application/pdf',
      sharedBy: 'John D',
      createdAt: '2025-03-25T14:55:00Z'
    }
  ],
  categories: [
    'Wills & Trusts',
    'Powers of Attorney',
    'Healthcare & Medical',
    'Insurance Policies',
    'Property & Deeds',
    'Personal Letters'
  ],
  filters: {
    search: '',
    category: 'all',
    status: 'any',
    type: 'any',
    sortBy: 'newest'
  },
  uploading: false,
  uploadError: null,
  isUploadPanelOpen: false,
  shareMenuForId: null,
  selectedCategory: null,
  selectedDocument: null,
  uploadProgress: 0,
  loading: false,
  error: null,
  totalStorage: 5000000000, // 5GB
  usedStorage: 1250000000, // 1.25GB
  recentUploads: [],
  sharedDocuments: [],
  encrypted: true
};

const documentVaultSlice = createSlice({
  name: 'documentVault',
  initialState,
  reducers: {
    setSearch: (state, action) => {
      state.filters.search = action.payload;
    },
    setCategory: (state, action) => {
      state.filters.category = action.payload;
    },
    setStatus: (state, action) => {
      state.filters.status = action.payload;
    },
    setType: (state, action) => {
      state.filters.type = action.payload;
    },
    setSort: (state, action) => {
      state.filters.sortBy = action.payload;
    },
    openUploadPanel: (state) => {
      state.isUploadPanelOpen = true;
    },
    closeUploadPanel: (state) => {
      state.isUploadPanelOpen = false;
    },
    openShareMenu: (state, action) => {
      state.shareMenuForId = action.payload;
    },
    closeShareMenu: (state) => {
      state.shareMenuForId = null;
    },
    setSelectedCategory: (state, action) => {
      state.selectedCategory = action.payload;
    },
    setSelectedDocument: (state, action) => {
      state.selectedDocument = action.payload;
    },
    updateUploadProgress: (state, action) => {
      state.uploadProgress = action.payload;
    },
    addDocument: (state, action) => {
      state.documents.push(action.payload);
      state.recentUploads.unshift(action.payload);
      if (state.recentUploads.length > 10) {
        state.recentUploads = state.recentUploads.slice(0, 10);
      }
      state.usedStorage += action.payload.size || 0;
    },
    updateDocument: (state, action) => {
      const index = state.documents.findIndex(doc => doc.id === action.payload.id);
      if (index !== -1) {
        state.documents[index] = { ...state.documents[index], ...action.payload };
      }
    },
    deleteDocument: (state, action) => {
      const document = state.documents.find(doc => doc.id === action.payload);
      if (document) {
        state.usedStorage -= document.size || 0;
      }
      state.documents = state.documents.filter(doc => doc.id !== action.payload);
      state.sharedDocuments = state.sharedDocuments.filter(doc => doc.id !== action.payload);
    },
    toggleEncryption: (state) => {
      state.encrypted = !state.encrypted;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getDocuments.pending, (state) => {
        state.loading = true;
      })
      .addCase(getDocuments.fulfilled, (state, action) => {
        state.loading = false;
        state.documents = action.payload.documents || [];
        state.usedStorage = action.payload.usedStorage || state.usedStorage;
        state.recentUploads = action.payload.recentUploads || [];
        state.sharedDocuments = action.payload.sharedDocuments || [];
      })
      .addCase(getDocuments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(uploadDocument.pending, (state) => {
        state.uploadProgress = 0;
      })
      .addCase(uploadDocument.fulfilled, (state, action) => {
        state.documents.push(action.payload);
        state.recentUploads.unshift(action.payload);
        if (state.recentUploads.length > 10) {
          state.recentUploads = state.recentUploads.slice(0, 10);
        }
        state.usedStorage += action.payload.size || 0;
        state.uploadProgress = 100;
      })
      .addCase(shareDocument.fulfilled, (state, action) => {
        const document = state.documents.find(doc => doc.id === action.payload.documentId);
        if (document) {
          document.shared = true;
          document.sharedWith = action.payload.sharedWith;
          state.sharedDocuments.push(document);
        }
      });
  }
});

export const {
  setSearch,
  setCategory,
  setStatus,
  setType,
  setSort,
  openUploadPanel,
  closeUploadPanel,
  openShareMenu,
  closeShareMenu,
  setSelectedCategory,
  setSelectedDocument,
  updateUploadProgress,
  addDocument,
  updateDocument,
  deleteDocument,
  toggleEncryption,
  clearError
} = documentVaultSlice.actions;

// Helper function to format file size
const formatSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

// Helper function to get MIME type display name
const shortMime = (mimeType) => {
  const mimeMap = {
    'application/pdf': 'PDF',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'DOCX',
    'text/markdown': 'MD',
    'application/vnd.ms-excel': 'XLS',
    'image/jpeg': 'JPG',
    'image/png': 'PNG'
  };
  return mimeMap[mimeType] || mimeType.split('/')[1]?.toUpperCase() || 'FILE';
};

// Helper function to format date
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

// Helper function to get status display text
const prettyStatus = (status) => {
  const statusMap = {
    completed: 'Completed',
    in_progress: 'In progress',
    pending_review: 'Pending review',
    overdue: 'Overdue'
  };
  return statusMap[status] || status;
};

export const selectDocumentVault = (state) => state.documentVault;
export const selectDocuments = (state) => state.documentVault.documents;
export const selectCategories = (state) => state.documentVault.categories;
export const selectFilters = (state) => state.documentVault.filters;
export const selectIsUploadPanelOpen = (state) => state.documentVault.isUploadPanelOpen;
export const selectShareMenuForId = (state) => state.documentVault.shareMenuForId;
export const selectSelectedCategory = (state) => state.documentVault.selectedCategory;
export const selectSelectedDocument = (state) => state.documentVault.selectedDocument;
export const selectRecentUploads = (state) => state.documentVault.recentUploads;
export const selectSharedDocuments = (state) => state.documentVault.sharedDocuments;

// Filtered documents selector
export const selectFilteredDocuments = (state) => {
  const { documents, filters } = state.documentVault;

  let filtered = [...documents];

  // Apply search filter
  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    filtered = filtered.filter(doc =>
      doc.name.toLowerCase().includes(searchLower) ||
      doc.category.toLowerCase().includes(searchLower) ||
      doc.sharedBy.toLowerCase().includes(searchLower)
    );
  }

  // Apply category filter
  if (filters.category !== 'all') {
    filtered = filtered.filter(doc => doc.category === filters.category);
  }

  // Apply status filter
  if (filters.status !== 'any') {
    filtered = filtered.filter(doc => doc.status === filters.status);
  }

  // Apply type filter
  if (filters.type !== 'any') {
    filtered = filtered.filter(doc => doc.mimeType === filters.type);
  }

  // Apply sorting
  filtered.sort((a, b) => {
    switch (filters.sortBy) {
      case 'newest':
        return new Date(b.createdAt) - new Date(a.createdAt);
      case 'oldest':
        return new Date(a.createdAt) - new Date(b.createdAt);
      case 'name':
        return a.name.localeCompare(b.name);
      case 'size':
        return b.sizeBytes - a.sizeBytes;
      default:
        return 0;
    }
  });

  return filtered;
};

export const selectStorageStats = (state) => ({
  total: state.documentVault.totalStorage,
  used: state.documentVault.usedStorage,
  percentage: (state.documentVault.usedStorage / state.documentVault.totalStorage) * 100
});

// Export helper functions for use in components
export { formatSize, shortMime, formatDate, prettyStatus };

export default documentVaultSlice.reducer;
