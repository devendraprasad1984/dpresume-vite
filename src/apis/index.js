import { config } from "../configs/config";

export default function get(uri, callback) {
  const header = config.header();
  fetch(uri, header)
    .then((res) => {
      return res.json();
    })
    .then((data) => callback(data))
    .catch((err) => callback({ error: err }));
}

export const getAsync = (uri) => {
  const header = config.header();
  try {
    return (async function () {
      const res = await fetch(uri, header);
      const resdata = await res.json();
      let data = await resdata;
      // console.log("ip", data);
      return await data;
    })();
  } catch (err) {
    console.log(err);
  }
};
