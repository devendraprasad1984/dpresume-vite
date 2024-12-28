import { makeAutoObservable, runInAction } from "mobx";

import adminService from "../services/admin-service";
import { IUserSearchForUI } from "../@types/Admin";
import fullName from "../utils/full-name";

const defaultPerPage = 50;

export default class adminPeopleStore {
  constructor() {
    makeAutoObservable(this);
  }

  /** Manage Selected **/
  user: IUserSearchForUI;
  isDisconnectModalOpen = false;
  isLoading: boolean = false;

  reset() {
    this.user = null;
    this.isDisconnectModalOpen = null;
  }

  setUser = (user: IUserSearchForUI) => {
    this.user = user;
  };

  setModalState = ({
    type,
    isOpen,
  }: {
    type: "disconnect";
    isOpen: boolean;
  }) => {
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
        this.users = res.data.result.data?.map((item) => ({
          ...item,
          name: fullName([item?.firstName, item?.lastName]),
        }));
      });
    } catch (error) {
      console.error(error);
    } finally {
      this.isLoading = false;
    }
  }
}
