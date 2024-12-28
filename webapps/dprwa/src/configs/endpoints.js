import {getOrgId} from "../apis/utils";

const islocal = window.location.href.indexOf("localhost") !== -1;
// let server = islocal ? "http://localhost:8080" : "https://dpresume.com/rwace";
let server = islocal ? "http://localhost:6204" : "https://dpresume.com/rwace";
let serverPrefix = `${server}/rwaceserver`;
let phpServing = `${serverPrefix}/rwa.php`;

const orgid=getOrgId()
const endpoints = {
  manifest: `${phpServing}/manifest.json`,
  postEndpointCommon: `${phpServing}`,
  EXPENSES_GROUP: `${phpServing}?expensesGroup=1&orgid=${orgid}`,
  BACKUP_JSON: `${phpServing}?backupJSON=1&orgid=${orgid}`,
  expensesByMember: `${phpServing}?expensesByMember=1&orgid=${orgid}`,
  expensesOnly: `${phpServing}?expensesOnly=1&orgid=${orgid}`,
  governingBody: `${phpServing}?keycontacts=1&orgid=${orgid}`,
  expensesByMonth: `${phpServing}?expensesByMonth=1&orgid=${orgid}`,
  showReminders: `${phpServing}?showReminders=1&orgid=${orgid}`,
  appConfig: `${phpServing}?config=1&orgid=${orgid}`,
};
export default endpoints;
