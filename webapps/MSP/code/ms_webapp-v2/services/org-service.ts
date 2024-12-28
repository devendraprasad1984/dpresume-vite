import {
  CompanyCategory,
  IInfo,
  IPersonnelSearch,
} from "ms-npm/company-models";
import { ICompanySearch } from "ms-npm/search-models/_/company-search.model";

import api from "./api";
import appEnvConstants from "./app-env-constants";
const apiSubPath =
  appEnvConstants?.api?.baseUrl + appEnvConstants?.api?.company;

const orgService = {
  fetchOrgInfo: (
    id
  ): Promise<{
    data: {
      result: IInfo;
    };
  }> =>
    api.post(`${apiSubPath}/info/filter`, {
      filter: "getByCompanyId",
      data: {
        companyId: id,
      },
    }),
  updateOrgInfo: (
    id,
    body: {
      category?: CompanyCategory;
      status?: string;
      name?: string;
      established?: number;
      city?: string;
      state?: string;
      photo?: string;
      bio?: string;
      video?: string;
      website?: string;
      linkedIn?: string;
      facebook?: string;
      instagram?: string;
      twitter?: string;
    }
  ): Promise<{
    data: {
      result: IInfo;
    };
  }> => api.patch(`${apiSubPath}/info/${id}`, body),
  fetchOrgs: (body?: {
    filter?: "explore";
    data?: {
      keyword?: string;
      location?: string[];
      industry?: string[];
      hasOpenJobs?: boolean;
    };
    perPage?: number;
    page?: number;
  }): Promise<{
    data: {
      result: {
        currentPage: number;
        data: ICompanySearch[];
        lastPage: number;
        totalCount: number;
      };
    };
  }> => api.post(`${apiSubPath}/filter`, body),
  fetchPersonnel: (body?: {
    filter?:
      | "getAllConnections"
      | "getEmployeeConnections"
      | "getUserConnections";
    data?: {
      companyId?: number;
    };
    perPage?: number;
    page?: number;
  }): Promise<{
    data: {
      result: {
        currentPage: number;
        data: IPersonnelSearch[];
        lastPage: number;
        totalCount: number;
      };
    };
  }> => api.post(`${apiSubPath}/personnel/filter`, body),
  addPersonnel: (
    body
  ): Promise<{
    data: {
      result: any;
    };
  }> => api.post(`${apiSubPath}/personnel`, body),
  updatePersonnel: (
    id,
    body
  ): Promise<{
    data: {
      result: IPersonnelSearch;
    };
  }> => api.patch(`${apiSubPath}/personnel/${id}`, body),
  deletePersonnel: (
    id: number
  ): Promise<{
    data: {
      result: string;
    };
  }> => api.delete(`${apiSubPath}/personnel/${id}`),
};

export default orgService;
