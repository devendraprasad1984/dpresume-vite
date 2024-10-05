import appEnum from "../enums/appEnum.js";
import core from "../core/core.js";
import Netflix from "../apps/netflix/netflix.jsx";
import SimpleForm from "../apps/simpleForm/simpleForm.jsx";
import AdminVideo from "../apps/geek/admin-video.jsx";

export const appMap = {
  [appEnum.simpleForm]: SimpleForm,
  [appEnum.netflix]: Netflix,
  [appEnum.geekAdminVideo]: AdminVideo,
};

const useAppSelectorComponentMap = ({currentApp}) => {
  if (!core.isPresent(currentApp)) {
    return;
  }
  return appMap[currentApp];
};
export default useAppSelectorComponentMap;