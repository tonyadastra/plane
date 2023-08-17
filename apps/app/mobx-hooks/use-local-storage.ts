import { useMobxStore } from "lib/mobx/store-provider";
import { useEffect, useState } from "react";

export const useLocalStorage = () => {
  const [state, setState] = useState({});
  const { theme: themeStore } = useMobxStore();

  useEffect(() => {
    if (window && window.localStorage) {
      const theme = window.localStorage.getItem("app_theme");
      themeStore.setTheme({});
    }
  }, [themeStore]);

  return undefined;
};
