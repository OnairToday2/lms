import { Control, useController } from "react-hook-form";
import { ClassRoom } from "../../classroom-form.schema";
import Image from "next/image";

export interface WallpaperPreviewProps {
  control: Control<ClassRoom>;
}
const WallpaperPreview: React.FC<WallpaperPreviewProps> = ({ control }) => {
  const {
    field: { value: thumbnail },
  } = useController({ control, name: "thumbnailUrl" });
  return (
    <div>
      <div className="pewview-ui__thumbnail aspect-[21/9] w-full rounded-xl relative overflow-hidden">
        {thumbnail ? (
          <Image src={thumbnail} alt="preview" fill style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <div className="w-full bg-blue-600/10 h-full"></div>
        )}
      </div>
    </div>
  );
};
export default WallpaperPreview;
