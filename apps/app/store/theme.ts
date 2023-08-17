// mobx
import { action, observable, makeObservable } from "mobx";
// helper
import { applyTheme, unsetCustomCssVariables } from "helpers/theme.helper";
// interfaces
import { ICurrentUserSettings, ICustomTheme } from "types";
import { IRootStore } from "./root";

export interface IThemeStore {
  sidebarCollapsed: boolean | null;
  theme: string | null;
  setTheme: (theme: any) => void;
  toggleSidebarCollapse: () => void;
}

class ThemeStore {
  sidebarCollapsed: boolean | null = null;
  theme: string | null = null;
  // root store
  rootStore: IRootStore;

  constructor(_rootStore: any | null = null) {
    makeObservable(this, {
      // observable
      sidebarCollapsed: observable,
      theme: observable,
      // action
      toggleSidebarCollapse: action,
      setTheme: action,
      // computed
    });

    this.rootStore = _rootStore;
    this.initialLoad();
  }

  toggleSidebarCollapse() {
    if (this.sidebarCollapsed === null) {
      let _sidebarCollapsed: string | boolean | null =
        localStorage.getItem("app_sidebar_collapsed");
      _sidebarCollapsed = _sidebarCollapsed ? (_sidebarCollapsed === "true" ? true : false) : false;
      this.sidebarCollapsed = _sidebarCollapsed;
    } else {
      this.sidebarCollapsed = !this.sidebarCollapsed;
      localStorage.setItem("app_sidebar_collapsed", this.sidebarCollapsed.toString());
    }
  }

  setTheme = async (_theme: { theme: ICurrentUserSettings }) => {
    try {
      const currentTheme: string = _theme.theme.theme.toString();

      // updating the local storage theme value
      localStorage.setItem("theme", currentTheme);
      // updating the mobx theme value
      this.theme = currentTheme;

      // applying the theme to platform if the selected theme is custom
      if (currentTheme === "custom") {
        const themeSettings = this.rootStore.user?.currentUser || null;
        if (themeSettings?.theme?.palette) {
          applyTheme(
            themeSettings?.theme?.palette !== ",,,,"
              ? themeSettings?.theme?.palette
              : "#0d101b,#c5c5c5,#3f76ff,#0d101b,#c5c5c5",
            themeSettings?.theme?.darkPalette
          );
        }
      } else unsetCustomCssVariables();
    } catch (error) {
      console.error("setting user theme error", error);
    }
  };

  // init load
  initialLoad() {}
}

export default ThemeStore;
