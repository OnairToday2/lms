import { StoreApi } from "zustand";
import { LibraryStoreActions, LibraryStore, LibraryStoreState, LibraryConfig } from "./libraryStore";
import { Resource } from "../types";
import { getCurrentUserLibrary } from "@/services/libraries/library.service";

const attachActions =
  (initState: LibraryStoreState) =>
    (
      set: StoreApi<LibraryStore>["setState"],
      get: StoreApi<LibraryStore>["getState"],
    ): LibraryStoreActions => ({
      openLibrary: async (config?: Partial<LibraryConfig>) => {
        return new Promise<Resource[]>(async (resolve, reject) => {
          try {
            let libraryId = config?.libraryId;

            if (!libraryId) {
              const library = await getCurrentUserLibrary();
              if (!library) {
                reject(new Error("No library found for current user"));
                return;
              }
              libraryId = library.id;
            }

            const finalConfig: LibraryConfig = {
              mode: config?.mode ?? "single",
              selectedIds: config?.selectedIds ?? [],
              libraryId,
            };

            set({
              open: true,
              config: finalConfig,
              resolve,
              reject,
            });
          } catch (error) {
            reject(error instanceof Error ? error : new Error("Failed to open library"));
          }
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

      setResources: (resources) => {
        set({
          resources,
        });
      },
    });

export default attachActions;
