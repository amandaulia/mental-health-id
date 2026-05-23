import { useEffect, useState } from "react";
import type { ImgHTMLAttributes } from "react";
import clinicPlaceholder from "@/assets/clinic-placeholder.png";
import { safeImageSrc } from "@/utils/imageUrl";

interface ImageWithFallbackProps extends ImgHTMLAttributes<HTMLImageElement> {
  fallbackSrc: string;
}

export const ImageWithFallback = ({
  src,
  fallbackSrc,
  onError,
  ...props
}: ImageWithFallbackProps) => {
  const [didFail, setDidFail] = useState(false);
  const [fallbackDidFail, setFallbackDidFail] = useState(false);
  const safeSrc = safeImageSrc(src);
  const imageSrc = fallbackDidFail ? clinicPlaceholder : didFail ? fallbackSrc : safeSrc || fallbackSrc;

  useEffect(() => {
    setDidFail(false);
    setFallbackDidFail(false);
  }, [safeSrc, fallbackSrc]);

  return (
    <img
      {...props}
      src={imageSrc}
      onError={(event) => {
        if (imageSrc !== fallbackSrc) {
          setDidFail(true);
        } else if (fallbackSrc !== clinicPlaceholder) {
          setFallbackDidFail(true);
        }
        onError?.(event);
      }}
    />
  );
};
