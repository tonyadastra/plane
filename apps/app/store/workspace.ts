// mobx
import { action, observable, makeObservable, runInAction } from "mobx";
import workspaceService from "services/workspace.service";
import { IIssue, IWorkspace } from "types";
import { IRootStore } from "./root";

export interface IWorkspaceStore {
  list: IWorkspace[] | null;
  activeWorkspace: IWorkspace | null;
  setActiveWorkspace: () => void;
  loadWorkspacesAsync: () => void;
  switchWorkspace: (workspace_id: string) => void;
}

class WorkspaceStore {
  // values
  list: IWorkspace[] | null = null;
  activeWorkspace: IWorkspace | null = null;
  // root store
  rootStore: IRootStore;

  constructor(_rootStore: IRootStore) {
    makeObservable(this, {
      // observable
      list: observable.ref,
      activeWorkspace: observable.ref,
      // action
      setActiveWorkspace: action,
      switchWorkspace: action,
      loadWorkspacesAsync: action,
      // computed
    });
    // root store
    this.rootStore = _rootStore;
  }

  setActiveWorkspace = (_workspaceId: string) => {
    console.log("_workspaceId", _workspaceId);
    if (_workspaceId) {
      const activeWorkspace: IWorkspace | null =
        this.list?.find((w) => w.id === _workspaceId) || null;
      console.log("activeWorkspace", activeWorkspace);
      runInAction(() => {
        this.activeWorkspace = activeWorkspace;
      });
    }
  };

  loadWorkspacesAsync = async () => {
    try {
      const response = await workspaceService.userWorkspaces();

      if (response && response.length > 0) {
        const _workspaces: IWorkspace[] = response?.map((_workspace: IWorkspace) => {
          const _wSpace = _workspace;
          return {
            id: _wSpace?.id,
            owner: _wSpace?.owner,
            total_members: _wSpace?.total_members,
            total_issues: _wSpace?.total_issues,
            created_at: _wSpace?.created_at,
            updated_at: _wSpace?.updated_at,
            name: _wSpace?.name,
            logo: _wSpace?.logo,
            slug: _wSpace?.slug,
            organization_size: _wSpace?.organization_size,
            created_by: _wSpace?.created_by,
            updated_by: _wSpace?.updated_by,
          };
        });

        _workspaces.map((_workspace: IWorkspace) => {
          console.log("_workspace", _workspace);
        });
        console.log(
          "this.rootStore.user?.currentUser?.last_workspace_id",
          this.rootStore.user?.currentUser?.last_workspace_id
        );

        if (_workspaces && _workspaces.length > 0) {
          runInAction(() => {
            this.list = _workspaces;
            this.setActiveWorkspace(this.rootStore.user?.currentUser?.last_workspace_id);
          });
        }
      }
    } catch (error) {
      console.log("Failed to load initial workspace data", error);
    }
  };

  switchWorkspace = async (workspace_id: string) => {
    try {
      runInAction(() => {
        this.rootStore?.user?.updateCurrentUserAsync({
          last_workspace_id: workspace_id,
        });
        this.setActiveWorkspace(workspace_id);
      });
    } catch (error) {
      console.log("Failed to load initial workspace data", error);
    }
  };
}

export default WorkspaceStore;
