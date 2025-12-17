import React, { useState, useRef, useEffect } from 'react';
import { Box, CircularProgress } from '@mui/material';

/**
 * Lazy-loaded image component with placeholder and error handling
 * 
 * @param {string} src - Image source URL
 * @param {string} alt - Alt text for accessibility
 * @param {string} placeholder - Placeholder image URL (optional)
 * @param {object} style - Custom styles
 * @param {string} className - CSS class name
 * @param {function} onLoad - Callback when image loads
 * @param {function} onError - Callback when image fails to load
 * @param {boolean} eager - If true, loads immediately (default: false for lazy loading)
 */
const LazyImage = ({
  src,
  alt = '',
  placeholder,
  style = {},
  className = '',
  onLoad,
  onError,
  eager = false,
  ...props
}) => {
  const [imageSrc, setImageSrc] = useState(placeholder || '');
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(eager);
  const imgRef = useRef(null);
  const observerRef = useRef(null);

  useEffect(() => {
    // If eager, load immediately
    if (eager) {
      setIsInView(true);
      return;
    }

    // Set up Intersection Observer for lazy loading
    if (!imgRef.current) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            if (observerRef.current) {
              observerRef.current.disconnect();
            }
          }
        });
      },
      {
        rootMargin: '50px', // Start loading 50px before image enters viewport
        threshold: 0.01,
      }
    );

    observerRef.current.observe(imgRef.current);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [eager]);

  useEffect(() => {
    if (!isInView) return;

    const img = new Image();
    
    img.onload = () => {
      setImageSrc(src);
      setIsLoaded(true);
      setHasError(false);
      if (onLoad) onLoad();
    };

    img.onerror = () => {
      setHasError(true);
      setIsLoaded(false);
      if (onError) onError();
    };

    img.src = src;
  }, [src, isInView, onLoad, onError]);

  return (
    <Box
      ref={imgRef}
      component="div"
      className={className}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        backgroundColor: '#f5f5f5',
        ...style,
      }}
      {...props}
    >
      {!isLoaded && !hasError && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f5f5f5',
          }}
        >
          <CircularProgress size={24} />
        </Box>
      )}

      {hasError && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#e0e0e0',
            color: '#999',
            fontSize: '0.875rem',
          }}
        >
          Failed to load image
        </Box>
      )}

      {imageSrc && (
        <img
          src={imageSrc}
          alt={alt}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: isLoaded ? 1 : 0,
            transition: 'opacity 0.3s ease-in-out',
          }}
          loading={eager ? 'eager' : 'lazy'}
          onLoad={() => setIsLoaded(true)}
          onError={() => {
            setHasError(true);
            if (onError) onError();
          }}
        />
      )}
    </Box>
  );
};

export default React.memo(LazyImage);

