// mobx
import { action, observable, computed, runInAction, makeObservable } from "mobx";
// services
import UserService from "services/user.service";
// interfaces
import { ICurrentUser, ICurrentUserSettings, IUser } from "types/users";
import { IRootStore } from "./root";

export interface IUserStore {
  currentUser: Partial<IUser> | null;
  loadUserDetails: () => void;
  updateCurrentUser: (user: any) => void;
}

class UserStore {
  currentUser: Partial<IUser> | null = null;
  // root store
  rootStore: IRootStore;

  constructor(_rootStore: IRootStore) {
    makeObservable(this, {
      // observable
      currentUser: observable.ref,
      // action
      loadUserDetails: action,
      updateCurrentUser: action,
      // computed
    });
    this.rootStore = _rootStore;
    this.initialLoad();
  }

  loadUserDetails = async () => {
    try {
      let userResponse: IUser | null = await UserService.currentUser();
      userResponse = userResponse || null;
      if (userResponse) {
        runInAction(() => {
          this.currentUser = userResponse;
        });
      }
    } catch (error) {
      console.error("Fetching current user error", error);
    }
  };

  updateCurrentUser = async (user: any) => {
    try {
      const userResponse: ICurrentUser = await UserService.updateUser(user);
      if (userResponse) {
        this.loadUserDetails();
      }
    } catch (error) {
      console.error("Updating user error", error);
      return error;
    }
  };

  // init load
  initialLoad() {}
}

export default UserStore;
