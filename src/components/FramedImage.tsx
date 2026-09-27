import React, { useState, useEffect } from 'react';
import { 
  ImageFramingConfig, 
  DEFAULT_FRAMING, 
  getImageFraming 
} from '@/src/lib/imageFramingStore';

interface FramedImageProps {
  imageKey: string;
  src: string;
  alt: string;
  className?: string;
  aspectClass?: string;
  title?: string;
  badge?: React.ReactNode;
  children?: React.ReactNode;
}

export const FramedImage: React.FC<FramedImageProps> = ({
  imageKey,
  src,
  alt,
  className = '',
  aspectClass = 'aspect-[16/10]',
  title = '',
  badge,
  children,
}) => {
  const [config, setConfig] = useState<ImageFramingConfig>(() => getImageFraming(imageKey));

  useEffect(() => {
    setConfig(getImageFraming(imageKey));

    const handleUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<{ key: string; config: ImageFramingConfig }>;
      if (customEvent.detail && customEvent.detail.key === imageKey) {
        setConfig(customEvent.detail.config);
      }
    };

    window.addEventListener('circus-image-framing-updated', handleUpdate);
    return () => {
      window.removeEventListener('circus-image-framing-updated', handleUpdate);
    };
  }, [imageKey]);

  // If user has a custom aspect ratio override
  const effectiveAspect = 
    config.aspectRatio === '16/9' ? 'aspect-video' :
    config.aspectRatio === '4/3' ? 'aspect-[4/3]' :
    config.aspectRatio === '1/1' ? 'aspect-square' : aspectClass;

  return (
    <div className={`relative ${effectiveAspect} w-full overflow-hidden bg-neutral-950 ${className}`}>
      {/* Framed Image Element */}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        draggable={false}
        style={{
          width: '100%',
          height: '100%',
          objectFit: config.fitMode,
          objectPosition: `${config.offsetX}% ${config.offsetY}%`,
          transform: `scale(${config.zoom / 100})`,
          transformOrigin: `${config.offsetX}% ${config.offsetY}%`,
          transition: 'transform 0.4s ease-out, object-position 0.4s ease-out',
        }}
        className="size-full group-hover:scale-[1.04] transition-all duration-500 opacity-95 group-hover:opacity-100 select-none"
      />

      {/* Theatrical Bottom Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

      {/* Floating Badge (Top Left) */}
      {badge && (
        <div className="absolute top-2.5 left-2.5 z-10 pointer-events-none">
          {badge}
        </div>
      )}



      {/* Optional Children (e.g. source citation link) */}
      {children}
    </div>
  );
};
