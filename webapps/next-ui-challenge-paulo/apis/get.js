const getFromApi = (url, callback) => {
  fetch(url)
    .then((res) => res.json())
    .then((data) => callback(data))
    .catch((err) => callback(err));
};

export const getFromApiAsync = async (url) => {
  let res = await fetch(url);
  let data = await res.json();
  return data;
};

export default getFromApi;
