import axios from "axios";
import qs from "qs";

const mockApi = axios.create({
  paramsSerializer: (params) =>
    qs.stringify(params, {
      arrayFormat: "repeat",
      skipNulls: true,
    }),
});

const { CancelToken } = axios;

export default mockApi;
export { CancelToken };
