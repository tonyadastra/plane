import { useEffect } from "react";
// mobx store
import { useMobxStore } from "lib/mobx/store-provider";

export const useUser = () => {
  const { user: userStore } = useMobxStore();

  useEffect(() => {
    // current user
    if (userStore?.currentUser === null) userStore.loadUserDetails();
  }, [userStore]);

  return undefined;
};
