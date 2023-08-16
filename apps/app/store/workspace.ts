// mobx
import { action, observable, makeObservable, runInAction } from "mobx";
import workspaceService from "services/workspace.service";
import { IIssue, IWorkspace } from "types";
import { IRootStore } from "./root";

export interface IWorkspaceStore {
  list: IWorkspace[];
  activeWorkspace: IWorkspace | null;
  switchWorkspace: (workspace_id: string) => void;
}

class WorkspaceStore {
  // root store
  rootStore: IRootStore;
  // values
  list: IWorkspace[] = [];
  activeWorkspace: IWorkspace | null = null;

  constructor(_rootStore: IRootStore) {
    makeObservable(this, {
      // observable
      list: observable,
      // action
      switchWorkspace: action,
      // computed
    });
    // root store
    this.rootStore = _rootStore;
    // initial load trigger
    this.initialLoad();
  }

  initialLoad = async () => {
    try {
      const response = await workspaceService.userWorkspaces();
      const activeWorkspace =
        response?.find((w) => w.slug === this.rootStore.user?.currentUser?.last_workspace_slug) ||
        null;
      if (response) {
        runInAction(() => {
          this.list = response;
          this.activeWorkspace = activeWorkspace;
        });
      }
    } catch (error) {
      console.log("Failed to load initial workspace data", error);
    }
  };

  switchWorkspace = async (workspace_id: string) => {
    try {
      runInAction(() => {
        this.rootStore?.user?.updateCurrentUser({
          last_workspace_id: workspace_id,
        });
        this.activeWorkspace = this.rootStore.user?.currentUser?.last_workspace_id;
      });
    } catch (error) {
      console.log("Failed to load initial workspace data", error);
    }
  };
}

export default WorkspaceStore;
