import { useEffect } from "react";
// next themes
import { useTheme } from "next-themes";
// mobx store, hooks and interfaces
import { observer } from "mobx-react-lite";
import { IRootStore } from "store/root";
import { useMobxStore } from "lib/mobx/store-provider";

const MobxStoreInit = observer(() => {
  const store: IRootStore = useMobxStore();
  const { user: userStore, theme: themeStore } = store;

  const { setTheme } = useTheme();

  // init app sidebar toggle
  useEffect(() => {
    if (window && window.localStorage && themeStore?.sidebarCollapsed === null)
      themeStore.toggleSidebarCollapse();
  }, [themeStore]);

  // init user store
  useEffect(() => {
    if (userStore?.currentUser === null && userStore?.isLoggingIn === false)
      userStore.loadUserDetailsAsync();
  }, [userStore, userStore?.isLoggingIn]);

  // init app theme
  useEffect(() => {
    if (userStore?.currentUser && userStore?.isLoggingIn && themeStore?.theme === null) {
      let currentLocalTheme = localStorage.getItem("app_theme");
      currentLocalTheme = currentLocalTheme ? currentLocalTheme : "system";
      const currentUserTheme = userStore?.currentUser?.theme?.theme || null;

      currentLocalTheme = currentUserTheme ? currentUserTheme : currentLocalTheme;

      if (currentLocalTheme === "custom") {
        themeStore.setTheme(currentLocalTheme, userStore?.currentUser?.theme);
        setTheme(currentLocalTheme);
      } else {
        themeStore.setTheme(currentLocalTheme, null);
        setTheme(currentLocalTheme);
      }
    }
  }, [themeStore, userStore?.isLoggingIn, userStore?.currentUser, setTheme]);

  return <></>;
});

export default MobxStoreInit;
