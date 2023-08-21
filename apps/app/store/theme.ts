// mobx
import { action, observable, makeObservable } from "mobx";
// helper
import { applyTheme, unsetCustomCssVariables } from "helpers/theme.helper";
// interfaces
import { IUser } from "types";
import { IRootStore } from "./root";
// services
import UserService from "services/user.service";

export interface IThemeStore {
  sidebarCollapsed: boolean | null;
  theme: string | null;
  toggleSidebarCollapse: () => void;
  setTheme: (_theme: string | null, _themeSettings: any | null) => void;
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
      const _sidebarCollapsed: boolean = !this.sidebarCollapsed;
      this.sidebarCollapsed = _sidebarCollapsed;
      localStorage.setItem("app_sidebar_collapsed", _sidebarCollapsed.toString());
    }
  }

  setTheme = async (_theme: string | null = null, _themeSettings: any | null = null) => {
    try {
      if (_theme) {
        const currentTheme: string = _theme && _theme.toString();
        // updating the local storage theme value
        localStorage.setItem("app_theme", currentTheme);
        // updating the mobx theme value
        this.theme = currentTheme;

        // applying the theme to platform if the selected theme is custom
        if (currentTheme === "custom") {
          const themeSettings = _themeSettings || null;
          if (themeSettings?.palette) {
            applyTheme(
              themeSettings?.palette !== ",,,,"
                ? themeSettings?.palette
                : "#0d101b,#c5c5c5,#3f76ff,#0d101b,#c5c5c5",
              themeSettings?.darkPalette
            );
          }
        } else unsetCustomCssVariables();
      } else {
        localStorage.removeItem("app_theme");
        this.theme = null;
        unsetCustomCssVariables();
      }
    } catch (error) {
      console.error("setting user theme error", error);
    }
  };

  // init load
  initialLoad() {}
}

export default ThemeStore;
