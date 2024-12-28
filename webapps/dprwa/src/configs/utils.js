const _win = window;
export const calculatePerformance = () => {
  const _perf = _win.performance;
  const start = _perf.now();
  const timing = _perf.timing;
  return {
    runtime: () => Math.floor(_perf.now() - start),
    perftime: () => Math.floor(timing.loadEventEnd - timing.navigationStart),
  };
};

export const download = (content, fileName, contentType = "text/plain") => {
  let a = document.createElement("a");
  let file = new Blob([content], {type: contentType});
  a.href = URL.createObjectURL(file);
  a.download = fileName;
  a.click();
};

export const json2csv = (data) => {
  // let json = data
  let csv = "";
  let sep = "\r\n";
  let line = "-".repeat(80);
  let replacer = function (key, value) {
    return value === null ? "" : value;
  };
  for (let k of Object.keys(data.data)) {
    let obj = data.data[k];
    csv += k;
    let flds = Object.keys(obj[0]);
    csv += sep + line + sep;
    csv += flds + sep;
    Object.values(obj).map((x) => {
      let vals = Object.values(x).join(",");
      csv += vals + sep;
    });
    csv += line + sep;
  }
  return csv;
};

export const json2xls = (data, filename) => {
  let XLSX = window.XLSX;
  if (XLSX === undefined) return;

  let wb = XLSX.utils.book_new();
  let keys = Object.keys(data.data);
  for (let k of keys) {
    let sheetObjectWithData = XLSX.utils.json_to_sheet(data.data[k] || []);
    XLSX.utils.book_append_sheet(wb, sheetObjectWithData, k);
  }
  XLSX.writeFile(wb, filename);
};


