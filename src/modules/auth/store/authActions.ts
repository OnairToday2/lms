import { StoreApi } from "zustand";
import { AuthStoreActions, AuthStore, AuthStoreState } from "./authStore";

import { authRepository } from "@/repository";
const attachActions =
  (initState: AuthStoreState) =>
  (
    set: StoreApi<AuthStore>["setState"],
    get: StoreApi<AuthStore>["getState"],
  ): AuthStoreActions => ({
    signOut: async (cb) => {
      set({ isLoading: true });
      try {
        const { error } = await authRepository.authSignOut();
        if (!error) {
          cb?.();
          set(() => ({ data: undefined, isLoading: false }));
        }
        set({ error: error?.message, isLoading: false });
      } catch (err) {
        set({ error: "loi", isLoading: false });
      }
    },
    reset: () => set({ data: undefined }),
  });
export default attachActions;
