import { StoreApi } from "zustand";
import { LibraryStoreActions, LibraryStore, LibraryStoreState, LibraryConfig } from "./libraryStore";
import { Resource } from "../types";

const attachActions =
  (initState: LibraryStoreState) =>
    (
      set: StoreApi<LibraryStore>["setState"],
      get: StoreApi<LibraryStore>["getState"],
    ): LibraryStoreActions => ({
      openLibrary: (config?: Partial<LibraryConfig>) => {
        return new Promise<Resource[]>((resolve, reject) => {
          const finalConfig: LibraryConfig = {
            mode: config?.mode ?? "single",
            selectedIds: config?.selectedIds ?? [],
          };

          set({
            open: true,
            config: finalConfig,
            resolve,
            reject,
          });
        });
      },

      closeLibrary: (resources?: Resource[]) => {
        const { resolve } = get();

        if (resolve) {
          resolve(resources ?? []);
        }

        set({
          open: false,
          config: null,
          resolve: null,
          reject: null,
        });
      },

      cancelLibrary: () => {
        const { reject } = get();

        if (reject) {
          reject(new Error("Library selection cancelled"));
        }

        set({
          open: false,
          config: null,
          resolve: null,
          reject: null,
        });
      },
    });

export default attachActions;
