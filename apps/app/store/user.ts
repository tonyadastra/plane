// mobx
import { action, observable, computed, runInAction, makeObservable } from "mobx";
// services
import UserService from "services/user.service";
// interfaces
import { ICurrentUser, ICurrentUserSettings, IUser } from "types/users";
import { IRootStore } from "./root";

export interface IUserStore {
  currentUser: Partial<IUser> | null;
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
      setCurrentUser: action,
      updateCurrentUser: action,
      // computed
    });
    this.rootStore = _rootStore;
    this.initialLoad();
  }

  setCurrentUser = async () => {
    try {
      let userResponse: IUser | null = await UserService.currentUser();
      userResponse = userResponse || null;

      if (userResponse) {
        const userPayload = {
          id: userResponse?.id,
          avatar: userResponse?.avatar,
          first_name: userResponse?.first_name,
          last_name: userResponse?.last_name,
          username: userResponse?.username,
          email: userResponse?.email,
          mobile_number: userResponse?.mobile_number,
          is_email_verified: userResponse?.is_email_verified,
          is_tour_completed: userResponse?.is_tour_completed,
          onboarding_step: userResponse?.onboarding_step,
          is_onboarded: userResponse?.is_onboarded,
          role: userResponse?.role,
        };
        runInAction(() => {
          this.currentUser = userPayload;
        });
      }
    } catch (error) {
      console.error("Fetching current user error", error);
    }
  };

  updateCurrentUser = async (user: any) => {
    try {
      let userResponse: ICurrentUser = await UserService.updateUser(user);
      userResponse = userResponse || null;

      if (userResponse) {
        const userPayload: ICurrentUser = {
          id: userResponse?.id,
          avatar: userResponse?.avatar,
          first_name: userResponse?.first_name,
          last_name: userResponse?.last_name,
          username: userResponse?.username,
          email: userResponse?.email,
          mobile_number: userResponse?.mobile_number,
          is_email_verified: userResponse?.is_email_verified,
          is_tour_completed: userResponse?.is_tour_completed,
          onboarding_step: userResponse?.onboarding_step,
          is_onboarded: userResponse?.is_onboarded,
          role: userResponse?.role,
        };
        runInAction(() => {
          this.currentUser = userPayload;
        });
        return userPayload;
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
