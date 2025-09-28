import {
  useSignInWithPasswordMutation,
  useSignInWithGoogleMutation,
} from "../operations/mutation";
import { AuthSignInWithPasswordPayload } from "@/repository/auth";

/**
 *
 * SIGN IN WITH PASSWORD
 */

export const useAuthSignInWithPassword = () => {
  const { mutate: signInWithPassword, isPending } =
    useSignInWithPasswordMutation();

  const onSignInWithPassword = (payload: AuthSignInWithPasswordPayload) => {
    signInWithPassword(payload, {
      onSuccess: () => {},
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
