import { createStore } from "zustand/vanilla";
import attachActions from "./authActions";
import { AuthData } from "../types";
type AuthStoreState = {
  data: AuthData;
};

type AuthStoreActions = {
  reset: () => void;
};

type AuthStore = AuthStoreState & AuthStoreActions;

const createAuthStore = (initState: AuthStoreState) => {
  return createStore<AuthStore>()((set, get) => ({
    ...initState,
    ...attachActions(initState)(set, get),
  }));
};
export { createAuthStore };
export type { AuthStore, AuthStoreActions, AuthStoreState };
