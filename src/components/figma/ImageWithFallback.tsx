"use client";

import { useEffect, useState } from "react";
import Image, { ImageProps } from "next/image";

const ERROR_IMG_SRC =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODgiIGhlaWdodD0iODgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc3Ryb2tlPSIjMDAwIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBvcGFjaXR5PSIuMyIgZmlsbD0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIzLjciPjxyZWN0IHg9IjE2IiB5PSIxNiIgd2lkdGg9IjU2IiBoZWlnaHQ9IjU2IiByeD0iNiIvPjxwYXRoIGQ9Im0xNiA1OCAxNi0xOCAzMiAzMiIvPjxjaXJjbGUgY3g9IjUzIiBjeT0iMzUiIHI9IjciLz48L3N2Zz4KCg==";

type SizeProps = { fill: true } | { width: number; height: number };

type Props = Omit<ImageProps, "src" | "alt" | "width" | "height" | "fill"> &
  SizeProps & {
    src: string;
    alt: string;
    fallbackSrc?: string;
  };

export default function ImageWithFallback({
  src,
  alt,
  fallbackSrc = ERROR_IMG_SRC,
  onError,
  ...rest
}: Props) {
  const [imgSrc, setImgSrc] = useState(src);

  useEffect(() => {
    setImgSrc(src);
  }, [src]);

  const handleError: NonNullable<ImageProps["onError"]> = (...args) => {
    if (imgSrc !== fallbackSrc) setImgSrc(fallbackSrc);
    if (typeof onError === "function") onError(...args);
  };

  return <Image src={imgSrc} alt={alt} onError={handleError} {...rest} />;
}
