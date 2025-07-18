/**
 * Responsive utilities for optimizing images and content delivery
 */

// Image format detection and optimization
export const getOptimalImageFormat = (): 'webp' | 'avif' | 'jpg' => {
  if (typeof window === 'undefined') return 'webp'; // Default for SSR
  
  // Check for WebP support
  const hasWebP = (() => {
    try {
      return document.createElement('canvas')
        .toDataURL('image/webp')
        .indexOf('data:image/webp') === 0;
    } catch (e) {
      return false;
    }
  })();
  
  // Check for AVIF support (more advanced but less supported)
  const hasAVIF = (() => {
    const img = new Image();
    return img.canPlayType && img.canPlayType('image/avif').replace(/no/, '');
  })();
  
  if (hasAVIF) return 'avif';
  if (hasWebP) return 'webp';
  return 'jpg';
};

// Generate responsive image srcSet based on device capabilities
export const generateResponsiveSrcSet = (
  basePath: string,
  widths: number[] = [640, 750, 828, 1080, 1200, 1920, 2048]
): string => {
  const format = getOptimalImageFormat();
  
  return widths
    .map(width => {
      // Handle different image formats
      const path = basePath.replace(/\.(jpg|jpeg|png|gif)$/, `.${format}`);
      return `${path}?w=${width} ${width}w`;
    })
    .join(', ');
};

// Calculate optimal image size based on viewport and device pixel ratio
export const getOptimalImageSize = (
  containerWidth: number,
  maxWidth: number = 2048
): number => {
  if (typeof window === 'undefined') return 1080; // Default for SSR
  
  const pixelRatio = window.devicePixelRatio || 1;
  const optimalWidth = containerWidth * pixelRatio;
  
  // Find the nearest standard size
  const standardSizes = [640, 750, 828, 1080, 1200, 1920, 2048];
  
  // Find the smallest standard size that's larger than what we need
  for (const size of standardSizes) {
    if (size >= optimalWidth) return Math.min(size, maxWidth);
  }
  
  // If we need something larger than our largest standard size, cap at maxWidth
  return Math.min(standardSizes[standardSizes.length - 1], maxWidth);
};

// Lazy loading detection
export const supportsLazyLoading = (): boolean => {
  if (typeof window === 'undefined') return false;
  return 'loading' in HTMLImageElement.prototype;
};

// Detect connection speed for adaptive loading
export const getConnectionSpeed = (): 'slow' | 'medium' | 'fast' => {
  if (typeof navigator === 'undefined' || !('connection' in navigator)) {
    return 'medium';
  }
  
  const connection = (navigator as unknown as { connection?: { effectiveType?: string; downlink?: number } }).connection;
  
  if (!connection) return 'medium';
  
  // Use effective connection type if available
  if (connection.effectiveType) {
    switch (connection.effectiveType) {
      case 'slow-2g':
      case '2g':
        return 'slow';
      case '3g':
        return 'medium';
      case '4g':
        return 'fast';
      default:
        return 'medium';
    }
  }
  
  // Fallback to downlink speed
  if (connection.downlink) {
    if (connection.downlink < 1) return 'slow';
    if (connection.downlink < 5) return 'medium';
    return 'fast';
  }
  
  return 'medium';
};

// Determine if we should preload critical images
export const shouldPreloadImages = (): boolean => {
  const connectionSpeed = getConnectionSpeed();
  return connectionSpeed === 'fast';
};

// Generate image loading priority based on visibility and importance
export const getImageLoadingStrategy = (
  isAboveFold: boolean,
  isImportant: boolean
): 'eager' | 'lazy' => {
  // Always load above-the-fold images eagerly
  if (isAboveFold) return 'eager';
  
  // For important below-fold images, consider connection speed
  if (isImportant) {
    const connectionSpeed = getConnectionSpeed();
    return connectionSpeed === 'fast' ? 'eager' : 'lazy';
  }
  
  // All other images load lazily
  return 'lazy';
};

// Generate responsive sizes attribute for images
export const getResponsiveSizes = (
  mobileWidth: string = '100vw',
  tabletWidth: string = '50vw',
  desktopWidth: string = '33vw'
): string => {
  return `(max-width: 640px) ${mobileWidth}, (max-width: 1024px) ${tabletWidth}, ${desktopWidth}`;
};

// Generate touch target class based on size to ensure minimum 44px touch targets
export const getTouchTargetClass = (size: 'small' | 'medium' | 'large'): string => {
  switch (size) {
    case 'small':
      return 'min-h-[44px] min-w-[44px]';
    case 'medium':
      return 'min-h-[48px] min-w-[48px]';
    case 'large':
      return 'min-h-[56px] min-w-[56px]';
    default:
      return 'min-h-[44px] min-w-[44px]';
  }
};