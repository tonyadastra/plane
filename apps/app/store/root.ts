// mobx lite
import { enableStaticRendering } from "mobx-react-lite";
// store imports
import UserStore, { IUserStore } from "./user";
import ThemeStore, { IThemeStore } from "./theme";
import WorkspaceStore, { IWorkspaceStore } from "./workspace";

const isServer = typeof window === "undefined";

enableStaticRendering(isServer);

export interface IRootStore {
  user: IUserStore | null;
  theme: IThemeStore | null;
  workspace: IWorkspaceStore | null;
}

export class RootStore {
  user: IUserStore;
  theme: IThemeStore;
  workspace: IWorkspaceStore;

  constructor() {
    this.user = new UserStore(this);
    this.theme = new ThemeStore(this);
    this.workspace = new WorkspaceStore(this);
  }
}
