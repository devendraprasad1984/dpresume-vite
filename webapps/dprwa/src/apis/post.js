// Example POST method implementation:
//fetch api - https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch

import axios from "axios";
import {getOrgId} from "./utils";

const getHeaderParams = (payload) => {
  let options = {
    method: "post",
    headers: {
      Accept: "application/json, text/plain, */*",
      "Content-Type":
        "application/x-www-form-urlencoded, application/json, charset=UTF-8",
      // 'Authorization': 'Bearer my-token',
    },
    body: JSON.stringify(payload),
  };
  return options;
};

export async function postData(url = "", payload = {}, callback) {
  try {
    const updatedPayload = {...payload, orgid: getOrgId()}
    fetch(url, getHeaderParams(updatedPayload))
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        callback({
          data,
          success:
            data?.status === 200 ||
            data?.data?.status === "success" ||
            data?.status === "success",
        });
      })
      .catch((err) => callback({err}));
  } catch (err) {
    callback({err});
  }
}

export async function postDataXmlHTTP(url = "", payload = {}, callback) {
  const updatedPayload = {...payload, orgid: getOrgId()}
  let request = new XMLHttpRequest();
  request.open("POST", url, true);
  request.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
  request.send(JSON.stringify(updatedPayload));
}

export async function postDataAxios(url = "", payload = {}, callback) {
  const updatedPayload = {...payload, orgid: getOrgId()}
  axios
    .post(url, updatedPayload)
    .then((data) =>
      callback({
        data,
        success: data.status === 200 || data.data.status === "success" || data.status === "success",
      })
    )
    .catch((err) => callback({err}));
}
