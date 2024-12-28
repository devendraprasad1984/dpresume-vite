import { IUserSearch, ICompany, INote } from "ms-npm/admin-models";

import api from "./api";
import appEnvConstants from "./app-env-constants";
import { IInfo } from "ms-npm/company-models/_/info.model";
const apiSubPath = appEnvConstants?.api?.baseUrl + appEnvConstants?.api?.admin;

const adminService = {
  fetchUsers: (
    params?,
    config?
  ): Promise<{
    data: {
      result: {
        data: IUserSearch[];
        totalCount: number;
        currentPage: number;
        lastPage: number;
      };
    };
  }> => api.get(`${apiSubPath}/user`, { params, ...config }),
  fetchOrgs: (
    params?,
    config?
  ): Promise<{
    data: {
      result: {
        data: ICompany[];
        totalCount: number;
        currentPage: number;
        lastPage: number;
      };
    };
  }> => api.get(`${apiSubPath}/company`, { params, ...config }),
  addOrg: (
    body
  ): Promise<{
    data: {
      result: IInfo;
    };
  }> => api.post(`${apiSubPath}/company`, body),
  fetchNotes: (
    body
  ): Promise<{
    data: {
      result: INote[];
    };
  }> => api.post(`${apiSubPath}/note/filter`, body),
  addNote: (body: {
    userId: number;
    text: string;
    status: string;
  }): Promise<{
    data;
  }> => api.post(`${apiSubPath}/note`, body),
  deleteNote: (
    noteId
  ): Promise<{
    data;
  }> => api.delete(`${apiSubPath}/note/${noteId}`),
  updateNote: (
    noteId,
    body: {
      text?: string;
      status?: string;
    }
  ): Promise<{
    data;
  }> => api.patch(`${apiSubPath}/note/${noteId}`, body),
};

export default adminService;
