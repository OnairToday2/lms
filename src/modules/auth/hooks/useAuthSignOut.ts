import { useAuthStore } from "../store/AuthProvider";
import { useSignOutMutation } from "../operations/mutation";
import { useRouter } from "next/navigation";

const useAuthSignOut = () => {
  const resetAuth = useAuthStore((state) => state.reset);
  const { mutate: authSignOut, isPending } = useSignOutMutation();

  const router = useRouter();

  const signOut = () => {
    authSignOut(undefined, {
      onSuccess: () => {
        router.refresh();
        resetAuth();
      },
    });
  };
  return { signOut, isPending };
};
export default useAuthSignOut;
