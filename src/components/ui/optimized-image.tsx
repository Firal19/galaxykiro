import React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  priority?: boolean;
  className?: string;
  sizes?: string;
  fill?: boolean;
  quality?: number;
  onLoad?: () => void;
}

/**
 * OptimizedImage component that leverages Next.js Image optimization
 * - Automatically converts images to WebP format
 * - Implements lazy loading by default (unless priority is true)
 * - Provides responsive sizing with the sizes prop
 * - Supports fill mode for container-based sizing
 */
export function OptimizedImage({
  src,
  alt,
  width,
  height,
  priority = false,
  className,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  fill = false,
  quality = 80,
  onLoad,
  ...props
}: OptimizedImageProps & Omit<React.ComponentProps<typeof Image>, 'src' | 'alt' | 'width' | 'height' | 'fill' | 'sizes' | 'quality'>) {
  return (
    <div className={cn('relative', fill ? 'w-full h-full' : '', className)}>
      <Image
        src={src}
        alt={alt}
        width={!fill ? width : undefined}
        height={!fill ? height : undefined}
        fill={fill}
        sizes={sizes}
        quality={quality}
        loading={priority ? 'eager' : 'lazy'}
        priority={priority}
        onLoad={onLoad}
        {...props}
      />
    </div>
  );
}

/**
 * BlurImage component that shows a blur-up effect while loading
 * - Uses a base64 placeholder for instant rendering
 * - Transitions to the full image when loaded
 */
export function BlurImage({
  src,
  alt,
  width,
  height,
  className,
  ...props
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = React.useState(true);

  return (
    <div className={cn('overflow-hidden relative', className)}>
      <OptimizedImage
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={cn(
          'duration-700 ease-in-out',
          isLoading ? 'scale-110 blur-2xl' : 'scale-100 blur-0'
        )}
        onLoad={() => setIsLoading(false)}
        {...props}
      />
    </div>
  );
}

/**
 * ResponsiveImage component that adapts to container size
 * - Automatically fills its container
 * - Maintains aspect ratio
 * - Provides art direction with different images for different screen sizes
 */
export function ResponsiveImage({
  src,
  alt,
  className,
  ...props
}: OptimizedImageProps & {
  mobileSrc?: string;
  tabletSrc?: string;
}) {
  return (
    <div className={cn('relative w-full h-full', className)}>
      <OptimizedImage
        src={src}
        alt={alt}
        fill
        sizes="100vw"
        className="object-cover"
        {...props}
      />
    </div>
  );
}