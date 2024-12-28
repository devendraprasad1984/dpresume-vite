import { makeAutoObservable, runInAction } from "mobx";

import { Session } from "../@types/Session";
import sessionService from "../services/session-service";

export default class adminSessionsStore {
  constructor() {
    makeAutoObservable(this);
  }

  /** Manage Selected **/
  session: Session;
  isArchiveModalOpen = false;
  isLoading: boolean = false;

  reset() {
    this.session = null;
    this.isArchiveModalOpen = null;
  }

  setSession = (session: Session) => {
    this.session = session;
  };

  setModalState = ({ type, isOpen }: { type: "archive"; isOpen: boolean }) => {
    if (type === "archive") this.isArchiveModalOpen = isOpen;
  };

  /** Manage List **/
  sessions: Session[] = [];
  searchQuery: string;
  perPage = 50;
  currentPage: number = 1;
  lastPage: number;
  count: number;

  resetSearch() {
    this.searchQuery = null;
    this.perPage = 50;
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
      const res = await sessionService.fetchSessions({
        q: this.searchQuery,
        perPage: this.perPage,
        page: this.currentPage,
      });

      runInAction(() => {
        this.currentPage = res.data.result.currentPage;
        this.lastPage = res.data.result.lastPage;
        this.count = res.data.result.totalCount;
        this.sessions = res.data.result.data;
      });
    } catch (error) {
      console.error(error);
    } finally {
      this.isLoading = false;
    }
  }
}
