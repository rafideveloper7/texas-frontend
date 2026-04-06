import Image from 'next/image';

// Legacy image helper kept for compatibility with older components.
export default function OptimizedImage({ src, alt, className, priority = false, width, height }) {
  // If the image is from Cloudinary, add auto quality and format
  let imageUrl = src;
  if (src?.includes('res.cloudinary.com')) {
    imageUrl = src.replace('/upload/', '/upload/q_auto,f_auto/');
  }

  return (
    <Image
      src={imageUrl}
      alt={alt}
      width={width}
      height={height}
      className={className}
      priority={priority}
      loading={priority ? 'eager' : 'lazy'}
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
    />
  );
}
