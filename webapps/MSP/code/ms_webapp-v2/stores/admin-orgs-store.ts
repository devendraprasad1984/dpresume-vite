import { makeAutoObservable, runInAction } from "mobx";
import { ICompany } from "ms-npm/admin-models";

import adminService from "../services/admin-service";

const defaultPerPage = 50;

export default class adminOrgsStore {
  constructor() {
    makeAutoObservable(this);
  }

  /** Manage Selected **/
  org: ICompany = null;
  isProfileDetailFlyoutOpen = false;
  profileDetailTab: "profile" | "conversation" | "notes" = "profile";
  isDeactivateModalOpen = false;
  isAddOrgModalOpen = false;
  isLoading: boolean = false;

  reset() {
    this.org = null;
    this.isDeactivateModalOpen = null;
    this.isAddOrgModalOpen = null;
  }

  setOrg = (org: ICompany) => {
    this.org = org;
  };

  setIsProfileDetailFlyoutOpen = (isOpen: boolean) => {
    this.isProfileDetailFlyoutOpen = isOpen;
  };

  setProfileDetailTab = (tab: "profile" | "conversation" | "notes") => {
    this.profileDetailTab = tab;
  };

  setModalState = ({
    type,
    isOpen,
  }: {
    type: "deactivate" | "addOrg";
    isOpen: boolean;
  }) => {
    if (type === "deactivate") this.isDeactivateModalOpen = isOpen;
    if (type === "addOrg") this.isAddOrgModalOpen = isOpen;
  };

  /** Manage List **/
  orgs: ICompany[] = [];
  searchQuery: string;
  perPage = defaultPerPage;
  currentPage: number = 1;
  lastPage: number;
  count: number;

  resetSearch() {
    this.searchQuery = null;
    this.perPage = defaultPerPage;
    this.currentPage = 1;
  }

  setSearchQuery = (q: string) => {
    this.searchQuery = q;
    this.currentPage = 1;
  };

  setPerPage = (page: string) => {
    this.perPage = +page;
    this.fetchData();
  };

  setCurrentPage = (page: string) => {
    this.currentPage = +page;
    this.fetchData();
  };

  goToFirstPage = () => {
    this.currentPage = 1;
    this.fetchData();
  };

  goToNextPage = () => {
    const nextPage = this.currentPage + 1;
    if (nextPage <= this.lastPage) {
      this.currentPage = nextPage;
      this.fetchData();
    }
  };

  goToPreviousPage = () => {
    const previousPage = this.currentPage - 1;
    if (previousPage >= 1) {
      this.currentPage = previousPage;
      this.fetchData();
    }
  };

  goToLastPage = () => {
    this.currentPage = this.lastPage;
    this.fetchData();
  };

  async fetchData() {
    this.isLoading = true;
    try {
      const res = await adminService.fetchOrgs({
        q: this.searchQuery,
        perPage: this.perPage,
        page: this.currentPage,
      });

      runInAction(() => {
        this.currentPage = res.data.result.currentPage;
        this.lastPage = res.data.result.lastPage;
        this.count = res.data.result.totalCount;
        this.orgs = res.data.result.data;
      });
    } catch (error) {
      console.error(error);
    } finally {
      this.isLoading = false;
    }
  }
}
