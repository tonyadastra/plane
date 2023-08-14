// mobx
import { action, observable, makeObservable, runInAction } from "mobx";
import workspaceService from "services/workspace.service";
import { IIssue, IWorkspace } from "types";

export interface IWorkspaceStore {
  list: IWorkspace[];
}

class WorkspaceStore {
  // root store
  rootStore;
  // values
  list: IWorkspace[] = [];

  constructor(_rootStore: any | null = null) {
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
      if (response) {
        runInAction(() => {
          this.list = response;
        });
      }
    } catch (error) {
      console.log("Failed to load initial workspace data", error);
    }
  };

  switchWorkspace() {
    this.rootStore;
  }
}

export default WorkspaceStore;
