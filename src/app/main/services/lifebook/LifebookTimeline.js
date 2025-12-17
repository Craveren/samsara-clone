import { useState, useEffect, memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { styled } from '@mui/material/styles';
import FusePageSimple from '@fuse/core/FusePageSimple';
import {
  selectTimeline,
  selectLifebookLoading,
  updateTimelineNode,
  setSelectedNode,
  selectSelectedNode
} from 'app/store/lifebookSlice';
import LazyImage from 'app/shared-components/LazyImage';
import useToastMessage from 'app/hooks/useToastMessage';

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
    color: #f5f5f5;
  }

  .editor-label {
    display: block;
    font-size: 13px;
    margin-bottom: 12px;
    color: #f5f5f5;
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
    font-family: inherit;
  }

  .editor-input:focus,
  .editor-textarea:focus {
    outline: none;
    border-color: #009ad9;
  }

  .editor-section {
    margin-top: 16px;
  }

  .editor-section h3 {
    color: #f5f5f5;
    font-size: 14px;
    margin: 0 0 8px 0;
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
    color: #f5f5f5;
  }

  .empty-state {
    font-size: 12px;
    opacity: 0.8;
    margin-top: 4px;
    color: #f5f5f5;
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
    font-weight: 500;
  }

  .btn-primary:hover {
    opacity: 0.9;
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

  .btn-danger:hover {
    background-color: #c62828;
  }

  .timeline-container {
    position: relative;
    max-width: 100%;
    margin: 0 auto;
    padding: 20px 0;
  }

  .timeline-line {
    position: absolute;
    left: 50%;
    top: 0;
    bottom: 0;
    width: 2px;
    background: linear-gradient(to bottom, #10B981, #3B82F6);
    transform: translateX(-50%);
    z-index: 1;
  }

  .timeline-item {
    position: relative;
    margin-bottom: 40px;
    display: flex;
    align-items: center;
    min-height: 120px;
  }

  .timeline-item.left {
    flex-direction: row-reverse;
  }

  .timeline-content {
    width: 45%;
    background-color: #181922;
    border-radius: 12px;
    padding: 20px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    cursor: pointer;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    border: 2px solid transparent;
  }

  .timeline-content:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 15px rgba(0, 0, 0, 0.2);
  }

  .timeline-content.selected {
    border-color: #009ad9;
    box-shadow: 0 0 20px rgba(0, 154, 217, 0.3);
  }

  .timeline-dot {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 16px;
    height: 16px;
    background: linear-gradient(90deg, #009ad9 0%, #d99300 60%, #ff4bc4 100%);
    border-radius: 50%;
    transform: translate(-50%, -50%);
    z-index: 2;
    border: 3px solid #0f1015;
  }

  .timeline-spacer {
    width: 5%;
  }

  .timeline-title {
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 8px;
    color: #f5f5f5;
  }

  .timeline-date {
    font-size: 12px;
    color: #a0a0a0;
    margin-bottom: 12px;
  }

  .timeline-description {
    font-size: 14px;
    line-height: 1.5;
    color: #d0d0d0;
    margin-bottom: 15px;
  }

  .timeline-images {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
    gap: 8px;
  }

  .timeline-image {
    width: 100%;
    height: 60px;
    object-fit: cover;
    border-radius: 6px;
    border: 1px solid #2b2d3a;
  }

  @media (max-width: 768px) {
    .app-shell {
      grid-template-columns: 1fr;
    }

    .timeline-container {
      padding-left: 20px;
    }

    .timeline-line {
      left: 20px;
    }

    .timeline-item {
      flex-direction: row !important;
    }

    .timeline-content {
      width: calc(100% - 40px);
      margin-left: 20px;
    }

    .timeline-spacer {
      width: 0;
    }

    .timeline-dot {
      left: 20px;
    }
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const existingStyle = document.getElementById('lifebook-timeline-styles');
  if (!existingStyle) {
    const styleElement = document.createElement('style');
    styleElement.id = 'lifebook-timeline-styles';
    styleElement.textContent = timelineStyles;
    document.head.appendChild(styleElement);
  }
}

const Root = styled(FusePageSimple)(({ theme }) => ({
  '& .FusePageSimple-header': {
    backgroundColor: theme.palette.background.paper,
    boxShadow: `inset 0 0 0 1px  ${theme.palette.divider}`,
  },
}));

// Convert timeline nodes to events format
const convertToEvents = (timelineNodes) => {
  if (!timelineNodes || timelineNodes.length === 0) {
    // Return default events if timeline is empty
    return [
      {
        id: 0,
        title: "The Beginning",
        date: "August 15, 1995",
        description: "Every great story starts somewhere. This is where your journey began, full of possibility and wonder. Share the memories that shaped your early years and the dreams that set your path in motion.",
        images: [
          {
            src: "/assets/images/avatars/brian-hughes.jpg",
            alt: "The start of an incredible journey"
          }
        ]
      },
      {
        id: 1,
        title: "Finding Your Path",
        date: "May 20, 2010",
        description: "The moment you discovered your true calling and began pursuing what sets your soul on fire. Whether it was a career change, a new passion, or finding your purpose - this was when everything clicked.",
        images: [
          {
            src: "/assets/images/apps/profile/morain-lake.jpg",
            alt: "Where dreams began to take shape"
          }
        ]
      },
      {
        id: 2,
        title: "Love & Connection",
        date: "December 1, 2018",
        description: "When hearts connected and life gained new meaning through the people who matter most. Love, friendship, family - these connections transform ordinary moments into extraordinary memories.",
        images: [
          {
            src: "/assets/images/apps/profile/braies-lake.jpg",
            alt: "Love makes every moment more beautiful"
          }
        ]
      },
      {
        id: 3,
        title: "Legacy in Motion",
        date: "October 15, 2023",
        description: "Today, you're building the foundation for generations to come. Your story continues to unfold with each decision, each memory, and each moment that shapes your legacy.",
        images: [
          {
            src: "/assets/images/apps/profile/lago-di-sorapis.jpg",
            alt: "Every day writes a new chapter"
          }
        ]
      }
    ];
  }

  return timelineNodes.map((node, index) => ({
    id: node.id || index,
    title: node.title || 'Untitled Event',
    date: node.date || new Date().toISOString().split('T')[0],
    description: node.description || '',
    images: node.images || []
  }));
};

function LifebookTimeline() {
  const dispatch = useDispatch();
  const timeline = useSelector(selectTimeline);
  const loading = useSelector(selectLifebookLoading);

  const [events, setEvents] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newImageAlt, setNewImageAlt] = useState('');

  useEffect(() => {
    const convertedEvents = convertToEvents(timeline);
    setEvents(convertedEvents);
    if (convertedEvents.length > 0 && timeline && timeline[0]) {
      dispatch(setSelectedNode(timeline[0]));
    }
  }, [timeline, dispatch]);

  const handleItemClick = (index) => {
    setSelectedIndex(index);
    if (timeline && timeline[index]) {
      dispatch(setSelectedNode(timeline[index]));
    }
  };

  const updateEvent = (index, updater) => {
    setEvents((prev) => {
      const next = [...prev];
      next[index] = updater(prev[index]);
      return next;
    });

    // Also update in Redux store if we have the original node
    if (timeline && timeline[index]) {
      const updatedEvent = updater(events[index]);
      const nodeData = {
        ...timeline[index],
        title: updatedEvent.title,
        description: updatedEvent.description,
        date: updatedEvent.date,
        images: updatedEvent.images || []
      };
      dispatch(updateTimelineNode(nodeData));
    }
  };

  const handleAddImage = () => {
    if (!newImageUrl.trim()) return;
    updateEvent(selectedIndex, (ev) => ({
      ...ev,
      images: [
        ...(ev.images || []),
        { src: newImageUrl.trim(), alt: newImageAlt.trim() || 'Timeline image' }
      ]
    }));
    setNewImageUrl('');
    setNewImageAlt('');
  };

  const handleRemoveImage = (imageIndex) => {
    updateEvent(selectedIndex, (ev) => ({
      ...ev,
      images: (ev.images || []).filter((_, i) => i !== imageIndex)
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

  if (loading) {
    return (
      <Root
        header={
          <div style={{ padding: '24px 32px 16px' }}>
            <h1 style={{ fontSize: '28px', fontWeight: '300', margin: '0 0 8px 0' }}>
              Your Lifebook Timeline
            </h1>
          </div>
        }
        content={
          <div style={{ padding: '40px', textAlign: 'center', color: '#f5f5f5' }}>
            Loading timeline...
          </div>
        }
      />
    );
  }

  return (
    <Root
      header={
        <div style={{ padding: '24px 32px 16px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: '300', margin: '0 0 8px 0', color: '#f5f5f5' }}>
            Your Lifebook Timeline
          </h1>
          <p style={{ fontSize: '16px', opacity: 0.9, margin: 0, lineHeight: '1.4', color: '#f5f5f5' }}>
            Your personal legacy story, told through life's most meaningful moments
          </p>
          <p style={{ fontSize: '14px', opacity: 0.7, margin: '8px 0 0 0', color: '#f5f5f5' }}>
            Explore your journey through interactive timeline nodes. Click any moment to dive deeper.
          </p>
        </div>
      }
      content={
        <div className="app-shell">
          <div className="timeline-column">
            {events.length > 0 ? (
              <div className="timeline-container">
                <div className="timeline-line"></div>
                {events.map((event, index) => (
                  <div
                    key={event.id}
                    className={`timeline-item ${index % 2 === 0 ? 'left' : ''}`}
                  >
                    <div className="timeline-spacer"></div>
                    <div
                      className={`timeline-content ${selectedIndex === index ? 'selected' : ''}`}
                      onClick={() => handleItemClick(index)}
                    >
                      <div className="timeline-title">{event.title}</div>
                      <div className="timeline-date">{event.date}</div>
                      <div className="timeline-description">
                        {event.description.length > 150
                          ? `${event.description.substring(0, 150)}...`
                          : event.description}
                      </div>
                      {event.images && event.images.length > 0 && (
                        <div className="timeline-images">
                          {event.images.slice(0, 3).map((image, imgIndex) => (
                            <img
                              key={imgIndex}
                              src={image.src}
                              alt={image.alt}
                              className="timeline-image"
                            />
                          ))}
                          {event.images.length > 3 && (
                            <div className="timeline-image" style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              backgroundColor: '#2b2d3a',
                              color: '#f5f5f5',
                              fontSize: '12px'
                            }}>
                              +{event.images.length - 3}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="timeline-spacer"></div>
                    <div className="timeline-dot"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ padding: '40px', textAlign: 'center', color: '#f5f5f5' }}>
                No timeline events yet. Start adding your life memories!
              </div>
            )}
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
                          <LazyImage 
                            src={img.src} 
                            alt={img.alt || `Memory image ${idx + 1}`}
                            style={{ width: '100%', height: '200px' }}
                          />
                          <div className="image-meta">
                            <div className="image-alt">{img.alt || 'No alt text'}</div>
                            <button
                              type="button"
                              className="btn-small btn-danger"
                              onClick={() => handleRemoveImage(idx)}
                              aria-label={`Remove image ${idx + 1}`}
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
      }
    />
  );
}

export default LifebookTimeline;
