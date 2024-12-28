import { IAuthResponse } from "ms-npm/auth-models";

import api from "./api";
import appEnvConstants from "./app-env-constants";
const apiSubPath = appEnvConstants?.api?.baseUrl + appEnvConstants?.api?.auth;

const authService = {
  validate: (
    token: string
  ): Promise<{
    data: {
      result: IAuthResponse;
    };
  }> =>
    api.get(`${apiSubPath}/validate`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
  connect: (
    ref: string
  ): Promise<{
    data: {
      result: {
        metadata: string;
      };
    };
  }> => api.get(`${apiSubPath}/connect/${ref}`),
};

export default authService;
