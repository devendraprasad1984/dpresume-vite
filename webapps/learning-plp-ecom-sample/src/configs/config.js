/* eslint-disable */
import BaseHeader from "./baseHeader";
import menu from "./menu";
import endpoints from "./endpoints";
import messages from "./messages";
import colors from "./colors";
import chars from "./chars";
import pageTitles from "./pageTitles";
import navigate from "./navigate";
import app_enums from "./enums";

export const config = {
    appName: "NuTech PLP Coding Challenge",
    codeBy: "developed by Devendra Prasad - Tech Lead Application Developer",
    developerPortfolio: 'https://dpresume.com',
    header: (method = "GET") => BaseHeader(method),
    navigate,
    menu,
    endpoints,
    messages,
    colors,
    chars,
    pageTitles,
    app_enums,
    dp2: (num) => parseFloat(num).toFixed(2)
}

