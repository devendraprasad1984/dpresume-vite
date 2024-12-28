import { makeAutoObservable, runInAction } from "mobx";
import { IInfo } from "ms-npm/company-models";

import orgService from "../services/org-service";

export default class AdminOrgStore {
  constructor() {
    makeAutoObservable(this);
  }

  org: IInfo = null;
  isSaving: boolean = false;
  isLoading: boolean = false;

  reset() {
    this.org = null;
  }

  setOrg = (org: IInfo) => {
    this.org = org;
  };

  setIsSaving = (isSaving: boolean) => {
    this.isSaving = isSaving;
  };

  reFetchData = () => {
    if (this.org?.id) {
      this.fetchData(this.org?.companyId);
    }
  };

  async fetchData(id: number) {
    this.isLoading = true;
    try {
      const res = await orgService.fetchOrgInfo(id);

      runInAction(() => {
        this.org = res?.data?.result?.[0];
      });
    } catch (error) {
      console.error(error);
    } finally {
      this.isLoading = false;
    }
  }
}
