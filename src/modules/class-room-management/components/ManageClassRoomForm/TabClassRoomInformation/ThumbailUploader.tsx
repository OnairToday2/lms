import Uploader, { UploaderProps } from "@/shared/ui/Uploader";
import useUpload from "@/modules/class-room-management/hooks/useUpload";
interface ThumbnailUploaderProps {
  onChange?: () => void;
}
const ThumbnailUploader = () => {
  const { onUpload } = useUpload();

  const onChange: UploaderProps["onChange"] = (files) => {
    console.log(files);
    if (!files || !files.length) return;
    // onUpload(files);
  };
  return <Uploader accept={{ images: [".jpg", ".jpeg", ".png"] }} onChange={onChange} />;
};
export default ThumbnailUploader;
