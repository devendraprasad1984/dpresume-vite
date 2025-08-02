import colors from "../../../core/colors.js";

const activeClassStyle = {
  textDecoration: "underline",
  backgroundColor: colors.light.colorgreen,
};

function seeIfActive() {
  return ({isActive}) => {
    return isActive ? activeClassStyle : {};
  };
}

const commonHelper = () => {
  return {
    activeClassStyle,
    seeIfActive
  };
};

export default commonHelper;