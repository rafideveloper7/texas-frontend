import Image from "next/image";

function getCloudinaryUrl(src) {
  if (!src?.includes("res.cloudinary.com")) {
    return src;
  }

  return src.replace("/upload/", "/upload/f_auto,q_auto,c_limit/");
}

export default function FastImage({
  src,
  alt,
  className,
  fill = false,
  width,
  height,
  sizes,
  priority = false,
  quality,
}) {
  const imageSrc = getCloudinaryUrl(src);

  if (!imageSrc) {
    return null;
  }

  return (
    <Image
      src={imageSrc}
      alt={alt}
      className={className}
      fill={fill}
      width={fill ? undefined : width}
      height={fill ? undefined : height}
      sizes={sizes}
      priority={priority}
      quality={quality}
      loading={priority ? "eager" : "lazy"}
    />
  );
}
