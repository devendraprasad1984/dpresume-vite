import React from "react";
import { download, json2csv, json2xls } from "../../../configs/utils";
import { config } from "../../../configs/config";
import get from "../../../apis";

const error = (err) => {
  console.log(err);
};

const handleBackup = (type = "csv") => {
  let fn = `backup_rwa_${new Date().toLocaleDateString()}`;
  switch (type) {
    case "json":
      get(
        config.endpoints.BACKUP_JSON,
        (res) => {
          download(JSON.stringify(res), `${fn}.json`);
        },
        (err) => error(err)
      );
      break;
    case "csv":
      get(
        config.endpoints.BACKUP_JSON,
        (res) => {
          let csvData = json2csv(res);
          download(csvData, `${fn}.csv`);
        },
        (err) => error(err)
      );
      break;
    case "xls":
      get(
        config.endpoints.BACKUP_JSON,
        (res) => {
          let filename = `${fn}.xls`;
          json2xls(res, filename);
        },
        (err) => error(err)
      );
      break;
    default:
      break;
  }
};

const BackupForm = (props) => {
  return (
    <>
      <div className="margin10l pad10">
        <button onClick={() => handleBackup("json")}>JSON</button>
        <button onClick={() => handleBackup("csv")}>CSV</button>
        <button onClick={() => handleBackup("xls")}>EXCEL</button>
      </div>
    </>
  );
};

export default BackupForm;
