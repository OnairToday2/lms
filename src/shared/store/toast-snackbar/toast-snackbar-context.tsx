"use client";
import { useStore } from "zustand";

import { type ReactNode, createContext, useRef, useContext } from "react";
import { ToastSnackbarStoreApi, createToastSnackbarStore } from "./toast-snackbar-store";

export type ToastSnackbarContextAPI = ReturnType<typeof createToastSnackbarStore>;

export const SnackbarContext = createContext<ToastSnackbarContextAPI | undefined>(undefined);

export interface ToastSnackbarProviderProps {
  children: ReactNode;
}

export const ToastSnackbarProvider = ({ children }: ToastSnackbarProviderProps) => {
  const storeRef = useRef<ToastSnackbarContextAPI | null>(null);
  if (!storeRef.current) {
    storeRef.current = createToastSnackbarStore();
  }
  return <SnackbarContext.Provider value={storeRef.current}>{children}</SnackbarContext.Provider>;
};

export const useToast = <T,>(selector: (store: ToastSnackbarStoreApi) => T): T => {
  const context = useContext(SnackbarContext);

  if (!context) {
    throw new Error(`useToast must be used within ToastSnackbarProvider`);
  }

  return useStore(context, selector);
};
