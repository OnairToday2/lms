import { createStore } from "zustand/vanilla";
import attachActions from "./authActions";
import { AuthData } from "../types";
type AuthStoreState = {
  data?: AuthData;
  isLoading?: boolean;
  error?: string;
};

type AuthStoreActions = {
  signOut: (cb?: () => void) => void;
  reset: () => void;
};

type AuthStore = AuthStoreState & AuthStoreActions;

const authStateInit: AuthStoreState = {
  data: undefined,
  isLoading: false,
  error: undefined,
};
const createAuthStore = (initState: AuthStoreState) => {
  return createStore<AuthStore>()((set, get) => ({
    ...initState,
    ...attachActions(initState)(set, get),
  }));
};
export { createAuthStore, authStateInit };
export type { AuthStore, AuthStoreActions, AuthStoreState };
