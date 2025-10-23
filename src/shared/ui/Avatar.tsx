import React, { memo } from "react";
import Image from "next/image";
import { cn } from "@/utils";

export interface AvatarProps {
  src?: string | null;
  alt?: string | null;
  width?: number;
  height?: number;
  className?: string;
}
const Avatar: React.FC<AvatarProps> = ({ src, alt = "", width = 40, height = 40, className }) => {
  const [isError, setIsError] = React.useState(false);
  const renderAvatarName = (alt?: string | null) => {
    const bgColor = getRandomColorHls();
    return (
      <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: bgColor }}>
        <span className="font-semibold text-sm">{alt?.charAt(0)}</span>
      </div>
    );
  };
  return (
    <div className={cn("avatar", "w-8 h-8 rounded-full overflow-hidden bg-gray-50", className)}>
      {src ? (
        <>
          {!isError ? (
            <Image
              src={src}
              loading="lazy"
              alt={alt ?? ""}
              placeholder="blur"
              blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAQAAAAm93DmAAAAKElEQVR42u3MQQEAAAQEMNdP/zqE4LkFWKbrVYRCoVAoFAqFQqHwZgFbMDPhJtVwHwAAAABJRU5ErkJggg=="
              quality={100}
              width={width}
              height={height}
              className="p-1"
              onError={(err) => {
                setIsError(true);
              }}
            />
          ) : (
            renderAvatarName(alt)
          )}
        </>
      ) : (
        renderAvatarName(alt)
      )}
    </div>
  );
};
export default memo(Avatar);
const getRandomColorHls = () => {
  const hue = Math.floor(Math.random() * 360);
  const h = (hue + (1 - Math.floor((Math.random() * 100) / 2)) * 12 + 360) % 360;
  const s = 60 + Math.random() * 15; // saturation 60-75
  const l = 78 + Math.random() * 6; // lightness 78-84
  return `hsl(${Math.round(h)} ${Math.round(s)}% ${Math.round(l)}%)`;
};
