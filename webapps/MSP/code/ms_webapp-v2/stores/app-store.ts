import { makeAutoObservable, runInAction } from "mobx";
import { IProfile } from "ms-npm/profile-models";
import adminService from "../services/admin-service";
import userService from "../services/user-service";
import { IMetadata } from "ms-npm/auth-models";

export default class AppStore {
  user: IProfile = null;
  initialized: boolean = null;
  onboarded: boolean = null;
  isMobileMenuOpen = false;

  constructor() {
    makeAutoObservable(this);
  }

  setUser = (payload: IProfile) => {
    this.user = payload;
  };

  setInitialized = (payload: boolean) => {
    this.initialized = payload;
  };

  setOnboarded = (payload: boolean) => {
    this.onboarded = payload;
  };

  async fetchUserData() {
    try {
      const res = await userService.fetchMyUserProfile();

      runInAction(() => {
        this.user = res.data.result;
      });
    } catch (error) {
      console.error(error);
    }
  }

  setIsMobileMenuOpen = (payload: boolean): void => {
    this.isMobileMenuOpen = payload;
  };
}
