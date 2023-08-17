import { useEffect } from "react";
// next themes
import { useTheme } from "next-themes";
// mobx store
import { useMobxStore } from "lib/mobx/store-provider";

export const useUserTheme = () => {
  const { user: userStore, theme: themeStore } = useMobxStore();
  const { setTheme } = useTheme();

  useEffect(() => {
    // sidebar collapsed toggle
    if (
      localStorage &&
      localStorage.getItem("app_sidebar_collapsed") &&
      themeStore?.sidebarCollapsed === null
    )
      themeStore.toggleSidebarCollapse();

    // theme
    if (themeStore?.theme === null && userStore?.currentUser) {
      let currentTheme = localStorage.getItem("theme");
      currentTheme = currentTheme ? currentTheme : "system";

      // validating the theme and applying for initial state
      if (currentTheme) {
        setTheme(currentTheme);
        themeStore.setTheme({ theme: { theme: currentTheme } });
      }
    }
  }, [themeStore, userStore, setTheme]);
};
