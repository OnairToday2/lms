import {
  useSignInWithPasswordMutation,
  useSignInWithGoogleMutation,
} from "../operations/mutation";
import { AuthSignInWithPasswordPayload } from "@/repository/auth";
import { useRouter } from "next/navigation";
/**
 *
 * SIGN IN WITH PASSWORD
 */

export const useAuthSignInWithPassword = () => {
  const { mutate: signInWithPassword, isPending } =
    useSignInWithPasswordMutation();
  const router = useRouter();
  const onSignInWithPassword = (payload: AuthSignInWithPasswordPayload) => {
    signInWithPassword(payload, {
      onSuccess: () => {
        router.push("/dashboard");
      },
    });
  };
  return { signInWithPassword: onSignInWithPassword, isPending };
};

/**
 *
 * SIGN IN WITH GOOGLE
 */
export const useAuthSignInWithGoogle = () => {
  const { mutate: signInWithGoogle, isPending } = useSignInWithGoogleMutation();
  const onSignInWithGoogle = () => {
    signInWithGoogle({
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    });
  };
  return { signInWithGoogle: onSignInWithGoogle, isPending };
};
