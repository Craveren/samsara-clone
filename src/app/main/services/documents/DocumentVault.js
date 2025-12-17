import FusePageSimple from '@fuse/core/FusePageSimple';
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import {
  selectFilteredDocuments,
  selectCategories,
  selectFilters,
  selectIsUploadPanelOpen,
  selectShareMenuForId,
  setSearch,
  setCategory,
  setStatus,
  setType,
  setSort,
  openUploadPanel,
  closeUploadPanel,
  openShareMenu,
  closeShareMenu,
  formatSize,
  shortMime,
  formatDate,
  prettyStatus
} from 'app/store/documentVaultSlice';
import DocumentStatus from '@fuse/core/WoodpeckerComponents/DocumentStatus';
import WoodpeckerCard from '@fuse/core/WoodpeckerComponents/WoodpeckerCard';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import './DocumentVault.scss';

// Category definitions with descriptions
const CATEGORIES = [
  { key: 'Wills & Trusts', description: 'Comprehensive estate planning documents.' },
  { key: 'Powers of Attorney', description: 'Financial and healthcare delegation.' },
  { key: 'Healthcare & Medical', description: 'Directives, HIPAA, living wills.' },
  { key: 'Insurance Policies', description: 'Life, health, property coverage.' },
  { key: 'Property & Deeds', description: 'Titles, deeds, ownership records.' },
  { key: 'Personal Letters', description: 'Letters of intent and legacy notes.' },
];

function VaultFilterBar({ filters }) {
  const dispatch = useDispatch();

  return (
    <section className="vault-filters">
      <input
        type="search"
        placeholder="Search documents…"
        value={filters.search}
        onChange={e => dispatch(setSearch(e.target.value))}
        className="vault-search-input"
      />
      <select
        value={filters.category}
        onChange={e => dispatch(setCategory(e.target.value))}
        className="vault-filter-select"
      >
        <option value="all">Category: All</option>
        {CATEGORIES.map(cat => (
          <option key={cat.key} value={cat.key}>{cat.key}</option>
        ))}
      </select>

      <select
        value={filters.status}
        onChange={e => dispatch(setStatus(e.target.value))}
        className="vault-filter-select"
      >
        <option value="any">Status: Any</option>
        <option value="completed">Completed</option>
        <option value="in_progress">In progress</option>
        <option value="pending_review">Pending review</option>
        <option value="overdue">Overdue</option>
      </select>

      <select
        value={filters.type}
        onChange={e => dispatch(setType(e.target.value))}
        className="vault-filter-select"
      >
        <option value="any">Type: Any</option>
        <option value="application/pdf">PDF</option>
        <option value="application/vnd.openxmlformats-officedocument.wordprocessingml.document">DOCX</option>
        <option value="text/markdown">Markdown</option>
        <option value="application/vnd.ms-excel">Spreadsheet</option>
      </select>

      <select
        value={filters.sortBy}
        onChange={e => dispatch(setSort(e.target.value))}
        className="vault-filter-select"
      >
        <option value="newest">Sort: Newest</option>
        <option value="oldest">Oldest</option>
        <option value="name">Name (A–Z)</option>
        <option value="size">Size</option>
      </select>
    </section>
  );
}

function VaultCategoryGrid() {
  const dispatch = useDispatch();
  const docs = useSelector(selectFilteredDocuments);

  return (
    <section className="vault-grid">
      {CATEGORIES.map(cat => {
        const count = docs.filter(d => d.category === cat.key).length;
        return (
          <button
            key={cat.key}
            className="vault-folder-card"
            onClick={() => dispatch(setCategory(cat.key))}
          >
            <div className="folder-icon-lg">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 7V17C3 18.1046 3.89543 19 5 19H19C20.1046 19 21 18.1046 21 17V9C21 7.89543 20.1046 7 19 7H12.4142C12.149 7 11.8946 6.89464 11.7071 6.70711L10.5858 5.58579C10.2107 5.21071 9.70201 5 9.17157 5H5C3.89543 5 3 5.89543 3 7Z" fill="#7c3aed" stroke="#7c3aed" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M8 13H16" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M8 9H16" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
            <div className="vault-folder-meta">
              <h3>{cat.key}</h3>
              <span className="vault-folder-count">{count} documents</span>
              <span className="vault-folder-link">Filter by this</span>
            </div>
          </button>
        );
      })}
    </section>
  );
}

function VaultDocumentsTable({ documents }) {
  const dispatch = useDispatch();
  const shareId = useSelector(selectShareMenuForId);
  const [currentPage, setCurrentPage] = useState(1);
  const docsPerPage = 10;

  const totalPages = Math.ceil(documents.length / docsPerPage);
  const startIndex = (currentPage - 1) * docsPerPage;
  const endIndex = startIndex + docsPerPage;
  const currentDocs = documents.slice(startIndex, endIndex);

  const handleShareMenuToggle = (docId) => {
    if (shareId === docId) {
      dispatch(closeShareMenu());
    } else {
      dispatch(openShareMenu(docId));
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <section className="vault-list">
      <header className="vault-list-header">
        <h2>All documents</h2>
      </header>

      <ul className="vault-doc-list">
        {currentDocs.map(doc => (
          <li key={doc.id} className="vault-doc-row">
            <div className="vault-doc-main">
              <span className="vault-doc-name">{doc.name}</span>
              <span className="vault-doc-meta">
                {doc.category} • {prettyStatus(doc.status)} • {doc.sharedBy} •
                {' '}{formatSize(doc.sizeBytes)} • {shortMime(doc.mimeType)} • {formatDate(doc.createdAt)}
              </span>
            </div>
            <div className="vault-doc-actions">
              <button className="vault-action-btn">View</button>
              <button className="vault-action-btn">Download</button>
              <div className="vault-doc-share">
                <button
                  className="vault-share-btn"
                  onClick={() => handleShareMenuToggle(doc.id)}
                >
                  Share ▾
                </button>
                {shareId === doc.id && (
                  <div className="vault-share-menu">
                    <button>Copy secure link</button>
                    <button>Email to contact…</button>
                    <button>Manage access…</button>
                  </div>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>

      {totalPages > 1 && (
        <div className="vault-pagination">
          <span className="vault-pagination-info">
            Page {currentPage} of {totalPages}
          </span>
          <div className="vault-pagination-controls">
            <button
              className="vault-pagination-btn"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              ‹ Prev
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                className={`vault-pagination-btn ${page === currentPage ? 'active' : ''}`}
                onClick={() => handlePageChange(page)}
              >
                {page}
              </button>
            ))}
            <button
              className="vault-pagination-btn"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next ›
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

function VaultUploadPanel() {
  const dispatch = useDispatch();
  const [category, setCategory] = useState('Wills & Trusts');
  const [status, setStatus] = useState('in_progress');
  const [shareEmails, setShareEmails] = useState(['']);

  const handleFilesSelected = (files) => {
    if (!files || !files.length) return;
    // TODO: Implement actual upload logic
    // Files selected - upload logic will be implemented
    if (process.env.NODE_ENV === 'development') {
      console.log('Files selected:', files.length, 'file(s)');
    }
  };

  const addShareEmail = () => {
    setShareEmails([...shareEmails, '']);
  };

  const updateShareEmail = (index, value) => {
    const newEmails = [...shareEmails];
    newEmails[index] = value;
    setShareEmails(newEmails);
  };

  const removeShareEmail = (index) => {
    if (shareEmails.length > 1) {
      setShareEmails(shareEmails.filter((_, i) => i !== index));
    }
  };

  return (
    <aside className="vault-upload-panel">
      <header className="vault-upload-header">
        <h2>Upload documents</h2>
        <button
          className="vault-close-btn"
          onClick={() => dispatch(closeUploadPanel())}
        >
          ✕
        </button>
      </header>

      <div
        className="vault-upload-dropzone"
        onDragOver={e => e.preventDefault()}
        onDrop={e => {
          e.preventDefault();
          handleFilesSelected(e.dataTransfer.files);
        }}
      >
        <p>Drag & drop files here</p>
        <p>or</p>
        <label className="vault-upload-browse">
          Browse files
          <input
            type="file"
            multiple
            onChange={e => handleFilesSelected(e.target.files)}
          />
        </label>
      </div>

      <label className="vault-upload-label">
        Category
        <select value={category} onChange={e => setCategory(e.target.value)}>
          {CATEGORIES.map(c => (
            <option key={c.key} value={c.key}>{c.key}</option>
          ))}
        </select>
      </label>

      <label className="vault-upload-label">
        Status
        <select value={status} onChange={e => setStatus(e.target.value)}>
          <option value="in_progress">In progress</option>
          <option value="completed">Completed</option>
          <option value="pending_review">Pending review</option>
        </select>
      </label>

      <div className="vault-upload-share-section">
        <label className="vault-upload-label">
          Share with:
        </label>
        {shareEmails.map((email, index) => (
          <div key={index} className="vault-share-email-row">
            <input
              type="email"
              placeholder="Add email / contact"
              value={email}
              onChange={(e) => updateShareEmail(index, e.target.value)}
              className="vault-share-email-input"
            />
            {shareEmails.length > 1 && (
              <button
                type="button"
                className="vault-share-email-remove"
                onClick={() => removeShareEmail(index)}
              >
                ×
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          className="vault-add-share-btn"
          onClick={addShareEmail}
        >
          + Add email / contact
        </button>
        <span className="vault-share-optional">(optional)</span>
      </div>

      <div className="vault-upload-footer">
        <button onClick={() => dispatch(closeUploadPanel())}>Cancel</button>
        <button>Save to vault</button>
      </div>
    </aside>
  );
}

function DocumentVault() {
  const dispatch = useDispatch();
  const docs = useSelector(selectFilteredDocuments);
  const filters = useSelector(selectFilters);
  const isUploadPanelOpen = useSelector(selectIsUploadPanelOpen);

  return (
    <FusePageSimple
      header={
        <Box p={3}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Document Vault
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            All documents across your estate, organized by category.
          </Typography>
        </Box>
      }
      content={
        <div className="vault-page">
          {/* Header */}
          <header className="vault-header">
            <div>
              <h1>Document Vault</h1>
              <p>All documents across your estate, organized by category.</p>
            </div>
            <button
              className="vault-upload-btn"
              onClick={() => dispatch(openUploadPanel())}
            >
              + Upload
            </button>
          </header>

          {/* Search & filters */}
          <VaultFilterBar filters={filters} />

          {/* Category folder grid */}
          <VaultCategoryGrid />

          {/* Docs table */}
          <VaultDocumentsTable documents={docs} />

          {isUploadPanelOpen && <VaultUploadPanel />}
        </div>
      }
    />
  );
}

export default DocumentVault;
