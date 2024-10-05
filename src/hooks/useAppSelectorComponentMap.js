import appEnum from "../enums/appEnum.js";
import JsReadHTMLAttributes from "../apps/customTagging/jsReadHTMLAttributes.jsx";
import core from "../core/core.js";
import Netflix from "../apps/netflix/netflix.jsx";
import SimpleForm from "../apps/simpleForm/simpleForm.jsx";

const useAppSelectorComponentMap = ({currentApp}) => {
  if (!core.isPresent(currentApp)) {
    return;
  }
  const appMap = {
    [appEnum.customWebComponent]: JsReadHTMLAttributes,
    [appEnum.netflix]: Netflix,
    [appEnum.simpleForm]: SimpleForm
  };
  return appMap[currentApp];
};
export default useAppSelectorComponentMap;