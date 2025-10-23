import { StoreApi } from "zustand";
import { AuthStoreActions, AuthStore, AuthStoreState } from "./authStore";

import { authRepository } from "@/repository";
const attachActions =
  (initState: AuthStoreState) =>
  (set: StoreApi<AuthStore>["setState"], get: StoreApi<AuthStore>["getState"]): AuthStoreActions => ({
    reset: () => set({ data: undefined }),
  });
export default attachActions;
