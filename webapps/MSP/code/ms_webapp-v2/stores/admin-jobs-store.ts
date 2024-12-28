import { makeAutoObservable, runInAction } from "mobx";

import { Job } from "../@types/Job";
import jobService from "../services/job-service";

export default class adminJobsStore {
  constructor() {
    makeAutoObservable(this);
  }

  /** Manage Selected **/
  job: Job;
  isArchiveModalOpen = false;
  isLoading: boolean = false;

  reset() {
    this.job = null;
    this.isArchiveModalOpen = null;
  }

  setJob = (job: Job) => {
    this.job = job;
  };

  setModalState = ({ type, isOpen }: { type: "archive"; isOpen: boolean }) => {
    if (type === "archive") this.isArchiveModalOpen = isOpen;
  };

  /** Manage List **/
  jobs: Job[] = [];
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
      const res = await jobService.fetchJobs({
        q: this.searchQuery,
        perPage: this.perPage,
        page: this.currentPage,
      });

      runInAction(() => {
        this.currentPage = res.data.result.currentPage;
        this.lastPage = res.data.result.lastPage;
        this.count = res.data.result.totalCount;
        this.jobs = res.data.result.data;
      });
    } catch (error) {
      console.error(error);
    } finally {
      this.isLoading = false;
    }
  }
}
