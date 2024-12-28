import { makeAutoObservable, runInAction } from "mobx";

import { IUserSearchForUI } from "../@types/Admin";
import adminService from "../services/admin-service";

const defaultPerPage = 50;

export default class AdminUsersStore {
  constructor() {
    makeAutoObservable(this);
  }

  /** Manage Selected **/
  user: IUserSearchForUI = null;
  isProfileDetailFlyoutOpen = false;
  profileDetailTab: "profile" | "conversation" | "notes" = "profile";
  isSuspendModalOpen = false;
  isAddNoteModalOpen = false;
  isChangeRoleModalOpen = false;
  isArchiveModalOpen = false;
  isUnArchiveModalOpen = false;
  isActivateModalOpen = false;
  isDisconnectModalOpen = false;

  isLoading: boolean = false;

  setUser = (user: IUserSearchForUI) => {
    this.user = user;
  };

  reset() {
    this.isSuspendModalOpen = false;
    this.isAddNoteModalOpen = false;
    this.isChangeRoleModalOpen = false;
    this.isArchiveModalOpen = false;
    this.isUnArchiveModalOpen = false;
    this.isActivateModalOpen = false;
    this.isDisconnectModalOpen = false;
  }

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
    type:
      | "suspend"
      | "addNote"
      | "changeRole"
      | "archive"
      | "unarchive"
      | "activate"
      | "disconnect";
    isOpen: boolean;
  }) => {
    if (type === "suspend") this.isSuspendModalOpen = isOpen;
    if (type === "addNote") this.isAddNoteModalOpen = isOpen;
    if (type === "changeRole") this.isChangeRoleModalOpen = isOpen;
    if (type === "archive") this.isArchiveModalOpen = isOpen;
    if (type === "unarchive") this.isUnArchiveModalOpen = isOpen;
    if (type === "activate") this.isActivateModalOpen = isOpen;
    if (type === "disconnect") this.isDisconnectModalOpen = isOpen;
  };

  /** Manage List **/
  users: IUserSearchForUI[] = [];
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
      const res = await adminService.fetchUsers({
        q: this.searchQuery,
        perPage: this.perPage,
        page: this.currentPage,
      });

      runInAction(() => {
        this.currentPage = res.data.result.currentPage;
        this.lastPage = res.data.result.lastPage;
        this.count = res.data.result.totalCount;
        this.users = res.data.result.data.map((item) => ({
          ...item,
          name: [item.firstName, item.lastName].join(" "),
        }));
      });
    } catch (error) {
      console.error(error);
    } finally {
      this.isLoading = false;
    }
  }
}
