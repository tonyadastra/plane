// next-themes
import { useTheme } from "next-themes";
// hooks
import useUser from "hooks/use-user";
// constants
import { THEMES_OBJ } from "constants/themes";
// ui
import { CustomSelect } from "components/ui";
// types
import { ICustomTheme } from "types";
import { unsetCustomCssVariables } from "helpers/theme.helper";
// mobx react lite
import { observer } from "mobx-react-lite";
// mobx store
import { useMobxStore } from "lib/mobx/store-provider";

type Props = {
  setPreLoadedData: React.Dispatch<React.SetStateAction<ICustomTheme | null>>;
  customThemeSelectorOptions: boolean;
  setCustomThemeSelectorOptions: React.Dispatch<React.SetStateAction<boolean>>;
};

export const ThemeSwitch: React.FC<Props> = observer(
  ({ setPreLoadedData, customThemeSelectorOptions, setCustomThemeSelectorOptions }) => {
    const { user: userStore, theme: themeStore } = useMobxStore();
    const { setTheme } = useTheme();

    const updateUserTheme = (newTheme: string) => {
      if (!userStore?.currentUser) return;
      setTheme(newTheme);
      themeStore.setTheme(newTheme, null);
      return userStore.updateCurrentUserAsync({
        ...userStore.currentUser,
        theme: { ...userStore.currentUser.theme, theme: newTheme },
      });
    };

    const currentThemeObj = THEMES_OBJ.find((t) => t.value === themeStore?.theme);

    return (
      <CustomSelect
        value={themeStore?.theme}
        label={
          currentThemeObj ? (
            <div className="flex items-center gap-2">
              <div
                className="border-1 relative flex h-4 w-4 rotate-45 transform items-center justify-center rounded-full border"
                style={{
                  borderColor: currentThemeObj.icon.border,
                }}
              >
                <div
                  className="h-full w-1/2 rounded-l-full"
                  style={{
                    background: currentThemeObj.icon.color1,
                  }}
                />
                <div
                  className="h-full w-1/2 rounded-r-full border-l"
                  style={{
                    borderLeftColor: currentThemeObj.icon.border,
                    background: currentThemeObj.icon.color2,
                  }}
                />
              </div>
              {currentThemeObj.label}
            </div>
          ) : (
            "Select your theme"
          )
        }
        onChange={({ value, type }: { value: string; type: string }) => {
          if (value === "custom") {
            if (
              userStore?.currentUser &&
              userStore?.currentUser?.theme &&
              userStore?.currentUser?.theme.palette
            ) {
              setPreLoadedData({
                background:
                  userStore?.currentUser?.theme.background !== ""
                    ? userStore?.currentUser?.theme.background
                    : "#0d101b",
                text:
                  userStore?.currentUser?.theme.text !== ""
                    ? userStore?.currentUser?.theme.text
                    : "#c5c5c5",
                primary:
                  userStore?.currentUser?.theme.primary !== ""
                    ? userStore?.currentUser?.theme.primary
                    : "#3f76ff",
                sidebarBackground:
                  userStore?.currentUser?.theme.sidebarBackground !== ""
                    ? userStore?.currentUser?.theme.sidebarBackground
                    : "#0d101b",
                sidebarText:
                  userStore?.currentUser?.theme.sidebarText !== ""
                    ? userStore?.currentUser?.theme.sidebarText
                    : "#c5c5c5",
                darkPalette: false,
                palette:
                  userStore?.currentUser?.theme.palette !== ",,,,"
                    ? userStore?.currentUser?.theme.palette
                    : "#0d101b,#c5c5c5,#3f76ff,#0d101b,#c5c5c5",
                theme: "custom",
              });
            }

            if (!customThemeSelectorOptions) setCustomThemeSelectorOptions(true);
          } else {
            if (customThemeSelectorOptions) setCustomThemeSelectorOptions(false);
            unsetCustomCssVariables();
          }

          updateUserTheme(value);
          document.documentElement.style.setProperty("--color-scheme", type);
        }}
        input
        width="w-full"
        position="right"
      >
        {THEMES_OBJ.map(({ value, label, type, icon }) => (
          <CustomSelect.Option key={value} value={{ value, type }}>
            <div className="flex items-center gap-2">
              <div
                className="border-1 relative flex h-4 w-4 rotate-45 transform items-center justify-center rounded-full border"
                style={{
                  borderColor: icon.border,
                }}
              >
                <div
                  className="h-full w-1/2 rounded-l-full"
                  style={{
                    background: icon.color1,
                  }}
                />
                <div
                  className="h-full w-1/2 rounded-r-full border-l"
                  style={{
                    borderLeftColor: icon.border,
                    background: icon.color2,
                  }}
                />
              </div>
              {label}
            </div>
          </CustomSelect.Option>
        ))}
      </CustomSelect>
    );
  }
);
