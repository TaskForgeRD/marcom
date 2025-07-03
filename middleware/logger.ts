import { StateCreator } from "zustand";

export const logger =
  <T extends object>(config: StateCreator<T>): StateCreator<T> =>
  (set, get, api) =>
    config(
      (args) => {
        console.log("[Zustand] State change:", args);
        set(args);
      },
      get,
      api
    );
