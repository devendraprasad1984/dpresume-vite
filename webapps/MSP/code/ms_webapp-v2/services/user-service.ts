import {
  IProfile,
  IWorkHistory,
  IEducationHistory,
} from "ms-npm/profile-models";

import api from "./api";
import appEnvConstants from "./app-env-constants";
import { IPeopleSearchForUI } from "../@types/Users";
import qs from "qs";
const apiSubPath = appEnvConstants?.api?.baseUrl + appEnvConstants?.api?.user;

const userService = {
  fetchMyUserProfile: (
    params?,
    config?
  ): Promise<{
    data: {
      result: IProfile;
    };
  }> => api.get(`${apiSubPath}/profile`, { params, ...config }),
  fetchUsers: (body?: {
    filter?: "connectedWithMe" | "notConnectedWithMe" | "peopleSearch";
    data?: {
      keyword?: string;
    };
    perPage?: number;
    page?: number;
  }): Promise<{
    data: {
      result: {
        currentPage: number;
        data: IPeopleSearchForUI[];
        lastPage: number;
        totalCount: number;
      };
    };
  }> => {
    return api.post(
      `${apiSubPath}/filter?${qs.stringify({
        perPage: body.perPage,
        page: body.page,
      })}`,
      body
    );
  },
  fetchUserProfile: (
    id
  ): Promise<{
    data: {
      result: IProfile;
    };
  }> =>
    api.post(`${apiSubPath}/profile/filter`, {
      filter: "getByUserId",
      data: {
        userId: id,
      },
    }),
  updateUser: (
    id,
    body
  ): Promise<{
    data: {
      result: IProfile;
    };
  }> => api.patch(`${apiSubPath}/${id}`, body),
  updateUserProfile: (
    id,
    body
  ): Promise<{
    data: {
      result: IProfile;
    };
  }> => api.patch(`${apiSubPath}/profile/${id}`, body),
  updateWorkHistory: (
    id,
    body
  ): Promise<{
    data: {
      result: IWorkHistory;
    };
  }> => api.patch(`${apiSubPath}/profile/workhistory/${id}`, body),
  addWorkHistory: (
    body
  ): Promise<{
    data: {
      result: IWorkHistory;
    };
  }> => api.post(`${apiSubPath}/profile/workhistory`, body),
  removeWorkHistory: (id) =>
    api.delete(`${apiSubPath}/profile/workhistory/${id}`),
  updateEducationHistory: (
    id,
    body
  ): Promise<{
    data: {
      result: IEducationHistory;
    };
  }> => api.patch(`${apiSubPath}/profile/educationhistory/${id}`, body),
  addEducationHistory: (
    body
  ): Promise<{
    data: {
      result: IEducationHistory;
    };
  }> => api.post(`${apiSubPath}/profile/educationhistory`, body),
  removeEducationHistory: (id) =>
    api.delete(`${apiSubPath}/profile/educationhistory/${id}`),
  // TODO: Match real API
  fetchPeopleConnections: (
    id
  ): Promise<{
    data: {
      result: IProfile[];
    };
  }> => api.get(`${apiSubPath}/profile`),
};

export default userService;
