import { useAuthStore } from "@/modules/auth/store/AuthProvider";
import { slugify } from "@/utils/slugify";
import { supabase } from "@/services";
import { useState } from "react";

type FileResponse =
  | {
      data: {
        id: string;
        path: string;
        fullPath: string;
      };
      error: null;
    }
  | {
      data: null;
      error: Error;
    };
interface UseUploadReturn {
  onUploadMultiple: (
    files: File[],
    options?: { onSuccess?: (response: PromiseSettledResult<FileResponse>[]) => void },
  ) => void;
  onUploadSingle: (file: File, options?: { onSuccess?: (response: FileResponse) => void }) => void;
}
const useUpload = () => {
  const userId = useAuthStore((state) => state.data?.id);
  const [isLoading, setIsLoading] = useState(false);
  const onUploadMultiple: UseUploadReturn["onUploadMultiple"] = async (files, options) => {
    const { onSuccess } = options || {};
    setIsLoading(true);
    const uploadFilePromises = files.reduce<
      Promise<{ data: { id: string; path: string; fullPath: string }; error: null } | { data: null; error: any }>[]
    >((acc, file) => {
      const fileName = `${slugify(file.name)}-${new Date().getTime()}`;
      const pathName = `${userId}/${fileName}`;
      const promise = supabase.storage.from("uploads").upload(pathName, file);
      acc = [...acc, promise];
      return acc;
    }, []);

    try {
      const response = await Promise.allSettled(uploadFilePromises);
      console.log(response);
      onSuccess?.(response);
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  const onUploadSingle: UseUploadReturn["onUploadSingle"] = async (file, options) => {
    const { onSuccess } = options || {};
    const fileName = `${slugify(file.name)}-${new Date().getTime()}`;
    const pathName = `${userId}/${fileName}`;
    setIsLoading(true);
    try {
      const response = await supabase.storage.from("uploads").upload(pathName, file);
      console.log(response);
      onSuccess?.(response);
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    onUploadMultiple,
    onUploadSingle,
    isLoading,
  };
};
export default useUpload;
