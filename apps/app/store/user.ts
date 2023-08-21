// mobx
import { action, observable, computed, runInAction, makeObservable } from "mobx";
// services
import UserService from "services/user.service";
// interfaces
import { IUser } from "types/users";
import { IRootStore } from "./root";

export interface IUserStore {
  // observable
  isLoggingIn: boolean;
  currentUser: IUser | null;
  // action
  setLoggingIn: (isLoggingIn: boolean) => void;
  setCurrentUser: (currentUser: IUser | null) => void;
  loadUserDetailsAsync: () => void;
  updateCurrentUserAsync: (user: Partial<IUser>) => void;
  // store
  rootStore: IRootStore;
}

class UserStore {
  isLoggingIn: boolean = false;
  currentUser: IUser | null = null;
  // root store
  rootStore: IRootStore;

  constructor(_rootStore: IRootStore) {
    makeObservable(this, {
      // observable
      isLoggingIn: observable,
      currentUser: observable.ref,
      // action
      setLoggingIn: action,
      setCurrentUser: action,
      loadUserDetailsAsync: action,
      updateCurrentUserAsync: action,
      // computed
    });
    // store
    this.rootStore = _rootStore;

    // init load
    this.initialLoad();
  }

  setLoggingIn = (_isLoggingIn: boolean) => {
    this.isLoggingIn = _isLoggingIn;
  };

  setCurrentUser = (_currentUser: IUser | null) => {
    this.currentUser = _currentUser;
  };

  loadUserDetailsAsync = async () => {
    try {
      let userResponse: IUser | null = await UserService.currentUser();
      userResponse = userResponse || null;
      if (userResponse)
        runInAction(() => {
          this.setCurrentUser(userResponse);
          this.setLoggingIn(true);
        });
      return {};
    } catch (error) {
      console.error("Fetching user error", error);
      return error;
    }
  };

  updateCurrentUserAsync = async (user: Partial<IUser>) => {
    try {
      const userResponse: IUser = await UserService.updateUser(user);
      if (userResponse) {
        this.loadUserDetailsAsync();
      }
      return {};
    } catch (error) {
      console.error("Updating user error", error);
      return error;
    }
  };

  // init load
  initialLoad() {}
}

export default UserStore;
