import rootNames from "../core/rootNames.js";

const useScreen = () => {

  const handleScreenToggle = () => {
    const docStyle = document.documentElement;
    const cur = getComputedStyle(docStyle).getPropertyValue(rootNames.htmlWidth);
    docStyle.style.setProperty(rootNames.htmlWidth, cur === "''" ? rootNames.desktopMaxWidth : "''");
  };

  return {
    handleScreenToggle
  };
};

export default useScreen;