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

export function postData(url = "", payload = {}, callback) {
  try {
    fetch(url, getHeaderParams(payload))
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        callback(data );
      })
      .catch((err) => callback({ err }));
  } catch (err) {
    callback({ err });
  }
}

export function postDataXmlHTTP(url = "", payload = {}, callback) {
  let request = new XMLHttpRequest();
  request.open("POST", url, true);
  request.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
  request.send(JSON.stringify(payload));
}
