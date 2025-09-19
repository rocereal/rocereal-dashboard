"use client";

import Image, { StaticImageData } from "next/image";
import React, { useState } from "react";
import { Blurhash } from "react-blurhash";
import useNextBlurhash from "use-next-blurhash";

export interface OptimizedImageProps {
  className?: string;
  blurDataURL?: string;
  placeholder?: string;
  onLoadComplete?: () => void;
  onError?: () => void;
  src?: string | StaticImageData | null;
  alt?: string;
  fill?: boolean;
  priority?: boolean;
  unoptimized?: boolean;
  sizes?: string;
  quality?: number;
  width?: number;
  height?: number;
  aspectRatio?: string;
  layout?: "responsive" | "fill" | "fixed" | "intrinsic";
}

const DEFAULT_BLURHASHES = [
  "LFMQR]~o%LHq0WVrMc-P9|IVrVrp",
  "L1LNuy00%gQ+00D$.9kD00_4VrMw",
  "L5Of*?cb.ArV?EM_xvx]E3xUkWWs",
  "L2Lz?QDNt600_34T8^IT?cofRPax",
  "LEPsbYRjM{s:0Kf8oet7?wjYt7ay",
  "LDQ9[|D*~Bt7xvofniR*-Uoe9aWB",
  "LHQJcbH?-r.9?HruV[NZ?^XmE0ic",
];

const ImageComponentOptimized: React.FC<OptimizedImageProps> = ({
  className = "",
  blurDataURL,
  placeholder,
  priority = false,
  unoptimized = false,
  onLoadComplete,
  onError,
  src,
  alt,
  fill = true,
  sizes,
  quality = priority ? 90 : 85,
  width,
  height,
  aspectRatio,
  layout = "fill",
  ...args
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Select a random blurhash if none is provided
  const randomBlurHash =
    blurDataURL ||
    DEFAULT_BLURHASHES[Math.floor(Math.random() * DEFAULT_BLURHASHES.length)];

  const [blurHash] = useNextBlurhash(randomBlurHash);

  const onLoadCallBack = () => {
    setImageLoaded(true);
    if (onLoadComplete) onLoadComplete();
  };

  const onErrorCallBack = () => {
    setHasError(true);
    if (onError) onError();
  };

  // Default responsive sizes based on common usage patterns
  const defaultSizes =
    sizes ||
    "(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw";

  // Container styles for aspect ratio
  const containerStyle = aspectRatio
    ? {
        aspectRatio,
        position: "relative" as const,
        width: "100%",
        height: fill ? "100%" : "auto",
      }
    : {
        position: "relative" as const,
        width: "100%",
        height: fill ? "100%" : "auto",
      };

  return (
    <div className={className} style={containerStyle}>
      {/* Blurhash Placeholder */}
      {!imageLoaded && !hasError && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            zIndex: 1,
          }}
        >
          <Blurhash
            hash={randomBlurHash}
            width="100%"
            height="100%"
            resolutionX={32}
            resolutionY={32}
            punch={1}
          />
        </div>
      )}

      {/* Optimized Next.js Image */}
      <Image
        src={src || ""}
        alt={alt || "Image"}
        fill={fill}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        sizes={defaultSizes}
        quality={quality}
        priority={priority}
        loading={priority ? "eager" : "lazy"}
        placeholder="blur"
        blurDataURL={blurHash}
        unoptimized={unoptimized}
        onLoad={onLoadCallBack}
        onError={onErrorCallBack}
        style={{
          objectFit: "cover",
          transition: "opacity 0.3s ease-in-out",
          opacity: imageLoaded ? 1 : 0,
        }}
        {...args}
      />
    </div>
  );
};

export default ImageComponentOptimized;
