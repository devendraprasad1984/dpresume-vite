import appEnum from "../enums/appEnum.js";
import JsReadHTMLAttributes from "../apps/customTagging/jsReadHTMLAttributes.jsx";
import core from "../core/core.js";
import Netflix from "../apps/netflix/netflix.jsx";

const useAppSelectorComponentMap = ({currentApp}) => {
  if (!core.isPresent(currentApp)) {
    return;
  }
  const appMap = {
    [appEnum.customWebComponent]: JsReadHTMLAttributes,
    [appEnum.netFlix]: Netflix
  };
  return appMap[currentApp];
};
export default useAppSelectorComponentMap;