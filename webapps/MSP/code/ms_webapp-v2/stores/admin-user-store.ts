import { makeAutoObservable, runInAction } from "mobx";
import { IProfile } from "ms-npm/profile-models";

import userService from "../services/user-service";

export default class AdminUserStore {
  constructor() {
    makeAutoObservable(this);
  }

  user: IProfile = null;
  isSaving: boolean = false;
  isLoading: boolean = false;

  reset() {
    this.user = null;
  }

  setUser = (user: IProfile) => {
    this.user = user;
  };

  setIsSaving = (isSaving: boolean) => {
    this.isSaving = isSaving;
  };

  reFetchData = () => {
    if (this.user?.id) {
      this.fetchData(this.user?.userId);
    }
  };

  async fetchData(id: number) {
    this.isLoading = true;
    try {
      const res = await userService.fetchUserProfile(id);

      runInAction(() => {
        this.user = res.data.result;
      });
    } catch (error) {
      console.error(error);
    } finally {
      this.isLoading = false;
    }
  }
}
