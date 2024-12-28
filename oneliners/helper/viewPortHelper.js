import {core} from "../core.js";

const headerEnum = {
  channel: {
    web: "WEB",
    mobile: "MOBILE"
  }
};

const isMobileMode = () => window.matchMedia("(max-width: 768px)").matches;

const isExtraSmallMobileMode = () => window.matchMedia("(max-width: 475px)").matches;

const isTabletMode = () => window.matchMedia(
  "(min-width: 768px) and (max-width: 1023px)").matches;

const isLargeTabletMode = () => window.matchMedia(
  "(min-width: 1024px) and (max-width: 1200px)").matches;

const isPortrait = () => (window.orientation === 0 || window.orientation === 180);

const isLandscape = () => (window.orientation === 90 || window.orientation === -90);

const getViewport = () => {
  return {
    top: window.pageYOffset,
    height: document.documentElement.clientHeight,
    width: document.documentElement.clientWidth,
    bottom: window.pageYOffset + document.documentElement.clientHeight,
    windowHeight: window.innerHeight,
    windowWidth: window.innerWidth
  };
};

const getScreenSizes = () => {
  return {
    mob_xxs: 320,
    mob_xs: 375,
    mob_sm: 540,
    tab_sm: 768,
    tab_lg: 900,
    desk_sm: 1024,
    desk_ss: 1200,
    desk_md: 1280,
    desk_ml: 1440,
    desk_xl: 1600,
    desk_xxl: 1920
  };
};

const isDarkMode = () => window.matchMedia && window.matchMedia(
  "(prefers-color-scheme: dark)").matches;

const isTouchEnabled = () => "ontouchstart" in document.documentElement;

const isIOS = () => typeof navigator !== "undefined" && /iPad|iPhone|iPod/.test(
  navigator.userAgent);

const getResponsiveModes = () => {
  const viewPort = getViewport();
  const viewSizes = getScreenSizes();
  const isMobileFormFactor = viewPort.width <= viewSizes.mob_sm;
  const isMobile = core.allTrue(
    isMobileFormFactor,
    isPortrait()
  );
  const isTablet = core.anyTrue([
    isPortrait(),
    core.allTrue(
      !isMobileFormFactor,
      (viewPort.width <= viewSizes.tab_lg)
    )
  ]);
  const isLargeTablet = core.anyTrue([
    isPortrait(),
    core.allTrue(
      !isMobileFormFactor,
      !isTablet,
      (viewPort.width > viewSizes.desk_sm),
      (viewPort.width <= viewSizes.desk_ss)
    )
  ]);
  const isDesktop = core.allTrue([
    !isMobile,
    !isTablet,
    isLargeTablet,
    isLandscape()
  ]);
  return {
    isMobile,
    isTablet,
    isLargeTablet,
    isDesktop
  };
};

const getChannel = () => {
  return getResponsiveModes().isMobile
    ? headerEnum.channel.mobile
    : headerEnum.channel.web;
};

const isDesktopMode = () => {
  return core.allTrue(
    !viewPortHelper.getResponsiveModes().isMobile,
    !viewPortHelper.getResponsiveModes().isTablet
  );
};

export const viewPortHelper = {
  isTabletMode,
  isLargeTabletMode,
  isMobileMode,
  isExtraSmallMobileMode,
  isPortrait,
  isLandscape,
  getViewport,
  getScreenSizes,
  isDarkMode,
  isTouchEnabled,
  isIOS,
  getResponsiveModes,
  getChannel,
  isDesktopMode
};

