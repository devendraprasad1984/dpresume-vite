import axios from "axios";
import qs from "qs";

const api = axios.create({
  paramsSerializer: (params) =>
    qs.stringify(params, {
      arrayFormat: "repeat",
      skipNulls: true,
    }),
});

const setMetadata = (metadata: string): void => {
  api.defaults.headers.common["Metadata"] = metadata;
};

const removeMetadata = (): void => {
  api.defaults.headers.common["Metadata"] = "";
};

const setAuthorization = (token: string): void => {
  api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
};

const removeAuthorization = (): void => {
  api.defaults.headers.common["Authorization"] = "";
};

const { CancelToken } = axios;

export default api;
export {
  CancelToken,
  setMetadata,
  removeMetadata,
  setAuthorization,
  removeAuthorization,
};
