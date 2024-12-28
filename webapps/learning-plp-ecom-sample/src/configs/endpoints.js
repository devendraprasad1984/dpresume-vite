// const islocal = window.location.href.indexOf("localhost") !== -1;
// const serverPrefix = islocal ? "http://localhost:3000" : "https://dpresume.com";
const serverPrefix = "http://localhost:3000"
const endpoints = {
  CATALOG: `${serverPrefix}/catalog`,
  FACETS: `${serverPrefix}/facets`,
};
export default endpoints;
