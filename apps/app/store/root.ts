// mobx lite
import { enableStaticRendering } from "mobx-react-lite";
// store imports
import UserStore, { IUserStore } from "./user";
import ThemeStore, { IThemeStore } from "./theme";
import ProjectPublishStore, { IProjectPublishStore } from "./project-publish";
import WorkspaceStore, { IWorkspaceStore } from "./workspace";

const isServer = typeof window === "undefined";
enableStaticRendering(isServer);

export interface IRootStore {
  user: IUserStore;
  theme: IThemeStore;
  workspace: IWorkspaceStore;
  projectPublish: IProjectPublishStore;
}

export class RootStore {
  user: IUserStore;
  theme: IThemeStore;
  workspace: IWorkspaceStore;
  projectPublish: IProjectPublishStore;

  constructor() {
    this.user = new UserStore(this);
    this.theme = new ThemeStore(this);
    this.workspace = new WorkspaceStore(this);
    this.projectPublish = new ProjectPublishStore(this);
  }
}
