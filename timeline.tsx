import * as React from "react";
import { useState } from 'react';
import { Timeline, sortEventList } from '@progress/kendo-react-layout';

// Add styles for the timeline
const timelineStyles = `
  .app-shell {
    display: grid;
    grid-template-columns: minmax(0, 2fr) minmax(0, 3fr);
    gap: 24px;
    padding: 24px;
    background-color: #0f1015;
    min-height: 100vh;
    color: #f5f5f5;
    box-sizing: border-box;
  }

  .timeline-column {
    background-color: #14151c;
    border-radius: 16px;
    padding: 16px;
    overflow: auto;
  }

  .editor-column {
    background-color: #14151c;
    border-radius: 16px;
    padding: 16px;
    overflow: auto;
  }

  .editor-card {
    background-color: #181922;
    border-radius: 12px;
    padding: 16px 18px 20px;
  }

  .editor-title {
    margin: 0 0 12px;
    font-size: 18px;
  }

  .editor-label {
    display: block;
    font-size: 13px;
    margin-bottom: 12px;
  }

  .editor-input,
  .editor-textarea {
    width: 100%;
    margin-top: 4px;
    padding: 8px 10px;
    border-radius: 6px;
    border: 1px solid #2b2d3a;
    background-color: #101119;
    color: #f5f5f5;
    font-size: 13px;
    resize: vertical;
  }

  .editor-section {
    margin-top: 16px;
  }

  .images-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
    gap: 12px;
    margin-top: 8px;
  }

  .image-card {
    background-color: #101119;
    border-radius: 8px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }

  .image-card img {
    width: 100%;
    height: 100px;
    object-fit: cover;
  }

  .image-meta {
    padding: 6px 8px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 6px;
  }

  .image-alt {
    font-size: 11px;
    opacity: 0.8;
  }

  .empty-state {
    font-size: 12px;
    opacity: 0.8;
    margin-top: 4px;
  }

  .add-image-form {
    margin-top: 12px;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .btn-primary {
    align-self: flex-start;
    padding: 6px 12px;
    border-radius: 999px;
    border: none;
    background: linear-gradient(90deg, #009ad9 0%, #d99300 60%, #ff4bc4 100%);
    color: #fff;
    font-size: 12px;
    cursor: pointer;
  }

  .btn-small {
    padding: 4px 8px;
    border-radius: 999px;
    border: none;
    font-size: 11px;
    cursor: pointer;
  }

  .btn-danger {
    background-color: #e53935;
    color: #fff;
  }

  .k-card-body > .k-card-actions {
    margin-top: 20px;
  }

  /* Kendo Timeline Dark Theme Overrides */
  .k-timeline {
    background-color: transparent;
    color: #f5f5f5;
  }

  .k-timeline .k-timeline-track {
    background-color: #2b2d3a;
  }

  .k-timeline .k-timeline-flag {
    background-color: #181922;
    border-color: #2b2d3a;
    color: #f5f5f5;
  }

  .k-timeline .k-timeline-circle {
    background-color: #009ad9;
    border-color: #2b2d3a;
  }

  .k-timeline .k-card {
    background-color: #181922;
    border-color: #2b2d3a;
    color: #f5f5f5;
  }

  .k-timeline .k-card-header {
    color: #f5f5f5;
  }

  .k-timeline .k-card-body {
    color: #f5f5f5;
  }

  .k-timeline .k-card-actions .k-button {
    background-color: #009ad9;
    border-color: #009ad9;
    color: #fff;
  }

  .k-timeline .k-card-actions .k-button:hover {
    background-color: #0077b3;
    border-color: #0077b3;
  }

  @media (max-width: 900px) {
    .app-shell {
      grid-template-columns: 1fr;
    }
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style');
  styleElement.textContent = timelineStyles;
  document.head.appendChild(styleElement);
}

type TimelineEntry = {
  date: string;
  title: string;
  content: string;
  images?: string[];
};

// Timeline event interface for Kendo
const initialEvents = [
  {
    description: "Every great story starts somewhere. This is where your journey began, full of possibility and wonder. Share the memories that shaped your early years and the dreams that set your path in motion.",
    date: new Date(1995, 7, 15),
    title: "The Beginning",
    subtitle: "August 15, 1995",
    images: [
      {
        src: "/assets/images/avatars/brian-hughes.jpg",
        alt: "The start of an incredible journey"
      }
    ],
    actions: [
      {
        text: "Explore early memories",
        url: "#early-memories"
      }
    ]
  },
  {
    description: "The moment you discovered your true calling and began pursuing what sets your soul on fire. Whether it was a career change, a new passion, or finding your purpose - this was when everything clicked.",
    date: new Date(2010, 4, 20),
    title: "Finding Your Path",
    subtitle: "May 20, 2010",
    images: [
      {
        src: "/assets/images/apps/profile/morain-lake.jpg",
        alt: "Where dreams began to take shape"
      }
    ],
    actions: [
      {
        text: "View career milestones",
        url: "#career-path"
      }
    ]
  },
  {
    description: "When hearts connected and life gained new meaning through the people who matter most. Love, friendship, family - these connections transform ordinary moments into extraordinary memories.",
    date: new Date(2018, 11, 1),
    title: "Love & Connection",
    subtitle: "December 1, 2018",
    images: [
      {
        src: "/assets/images/apps/profile/braies-lake.jpg",
        alt: "Love makes every moment more beautiful"
      }
    ],
    actions: [
      {
        text: "See relationship memories",
        url: "#relationships"
      }
    ]
  },
  {
    description: "Today, you're building the foundation for generations to come. Your story continues to unfold with each decision, each memory, and each moment that shapes your legacy.",
    date: new Date(2023, 9, 15),
    title: "Legacy in Motion",
    subtitle: "October 15, 2023",
    images: [
      {
        src: "/assets/images/apps/profile/lago-di-sorapis.jpg",
        alt: "Every day writes a new chapter"
      }
    ],
    actions: [
      {
        text: "Plan future memories",
        url: "#future-plans"
      }
    ]
  }
];

const Timeline9 = () => {
  const [events, setEvents] = useState(sortEventList(initialEvents));
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newImageAlt, setNewImageAlt] = useState('');

  const onActionClick = (e) => {
    const event = e.syntheticEvent;
    event.preventDefault();
    const href = event.target.getAttribute('href');
    if (href) {
      window.open(href, '_blank');
    }
  };

  const handleItemClick = (e) => {
    setSelectedIndex(e.itemIndex ?? 0);
  };

  const updateEvent = (index, updater) => {
    setEvents((prev) => {
      const next = [...prev];
      next[index] = updater(prev[index]);
      return next;
    });
  };

  const handleAddImage = () => {
    if (!newImageUrl.trim()) return;
    updateEvent(selectedIndex, (ev) => ({
      ...ev,
      images: [
        ...(ev.images ?? []),
        { src: newImageUrl.trim(), alt: newImageAlt.trim() || undefined }
      ]
    }));
    setNewImageUrl('');
    setNewImageAlt('');
  };

  const handleRemoveImage = (imageIndex) => {
    updateEvent(selectedIndex, (ev) => ({
      ...ev,
      images: (ev.images ?? []).filter((_, i) => i !== imageIndex)
    }));
  };

  const handleDescriptionChange = (e) => {
    const value = e.target.value;
    updateEvent(selectedIndex, (ev) => ({ ...ev, description: value }));
  };

  const handleTitleChange = (e) => {
    const value = e.target.value;
    updateEvent(selectedIndex, (ev) => ({ ...ev, title: value }));
  };

  const selectedEvent = events[selectedIndex];

  return (
    <section className="bg-background py-32">
      <div className="container">
        <h1 className="text-foreground mb-10 text-center text-3xl font-bold tracking-tighter sm:text-6xl">
          Your Lifebook Timeline
        </h1>

        <div className="app-shell">
          <div className="timeline-column">
            <Timeline
              events={events}
              alterMode={true}
              collapsibleEvents={true}
              onActionClick={onActionClick}
              onItemClick={handleItemClick}
            />
          </div>
          <div className="editor-column">
            {selectedEvent && (
              <div className="editor-card">
                <h2 className="editor-title">Edit memory</h2>
                <label className="editor-label">
                  Title
                  <input
                    className="editor-input"
                    value={selectedEvent.title}
                    onChange={handleTitleChange}
                  />
                </label>
                <label className="editor-label">
                  Description
                  <textarea
                    className="editor-textarea"
                    value={selectedEvent.description}
                    onChange={handleDescriptionChange}
                    rows={6}
                  />
                </label>
                <div className="editor-section">
                  <h3>Pictures</h3>
                  {selectedEvent.images && selectedEvent.images.length > 0 ? (
                    <div className="images-grid">
                      {selectedEvent.images.map((img, idx) => (
                        <div key={idx} className="image-card">
                          <img src={img.src} alt={img.alt || ''} />
                          <div className="image-meta">
                            <div className="image-alt">{img.alt || 'No alt text'}</div>
                            <button
                              type="button"
                              className="btn-small btn-danger"
                              onClick={() => handleRemoveImage(idx)}
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="empty-state">No pictures yet. Add your first memory photo below.</p>
                  )}
                  <div className="add-image-form">
                    <input
                      className="editor-input"
                      placeholder="Image URL"
                      value={newImageUrl}
                      onChange={(e) => setNewImageUrl(e.target.value)}
                    />
                    <input
                      className="editor-input"
                      placeholder="Alt text (optional)"
                      value={newImageAlt}
                      onChange={(e) => setNewImageAlt(e.target.value)}
                    />
                    <button
                      type="button"
                      className="btn-primary"
                      onClick={handleAddImage}
                    >
                      Add picture
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export { Timeline9 };
