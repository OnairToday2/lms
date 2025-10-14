import { createClient } from "@/services";
import { useAuthStore } from "@/modules/auth/store/AuthProvider";
import { slugify } from "@/utils/slugify";

const useUpload = () => {
  const supabase = createClient();
  const userId = useAuthStore((state) => state.data?.id);
  const onUpload = async (files: File[]) => {
    if (!userId) {
      throw new Error("Invalid User Id");
    }

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
    } catch (err) {
      console.log(err);
    }
  };
  return {
    onUpload,
  };
};
export default useUpload;
