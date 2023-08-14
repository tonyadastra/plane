import { createContext, useContext } from "react";
// mobx store
import { IRootStore, RootStore } from "store/root";

let rootStore: IRootStore = {
  workspace: null,
  theme: null,
  user: null,
};

export const MobxStoreContext = createContext(rootStore);

const initializeStore = () => {
  const _rootStore = rootStore ?? new RootStore();

  if (typeof window === "undefined") return _rootStore;

  if (!rootStore) rootStore = _rootStore;

  return _rootStore;
};

export const MobxStoreProvider = ({ children }: any) => {
  const store = initializeStore();

  return <MobxStoreContext.Provider value={store}>{children}</MobxStoreContext.Provider>;
};

// hook
export const useMobxStore = () => {
  const context = useContext(MobxStoreContext);
  if (context === undefined) throw new Error("useMobxStore must be used within MobxStoreProvider");
  return context;
};
