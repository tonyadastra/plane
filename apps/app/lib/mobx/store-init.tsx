import { useUser } from "mobx-hooks/use-user";
import { useUserTheme } from "mobx-hooks/use-user-theme";

const MobxStoreInit = () => {
  useUser();
  useUserTheme();

  return <></>;
};

export default MobxStoreInit;
