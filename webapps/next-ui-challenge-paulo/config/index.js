import menus from "./menu";
import base from "./base";
import endpoints from "./endpoints";
import symbols from "./symbols";
import * as formatters from "./formatters";
import navLinks from "./navLinks";

const config = {
  menus,
  base,
  symbols,
  endpoints,
  revalidateTime: 24 * 60 * 60,
  formatters,
  navLinks
};

export default config;
