import { makeAutoObservable, runInAction } from "mobx";

import { Topic } from "../@types/Topic";
import topicService from "../services/topic-service";

export default class adminTopicsStore {
  constructor() {
    makeAutoObservable(this);
  }

  /** Manage Selected **/
  topic: Topic;
  isArchiveModalOpen = false;
  isLoading: boolean = false;

  reset() {
    this.topic = null;
    this.isArchiveModalOpen = null;
  }

  setTopic = (topic: Topic) => {
    this.topic = topic;
  };

  setModalState = ({ type, isOpen }: { type: "archive"; isOpen: boolean }) => {
    if (type === "archive") this.isArchiveModalOpen = isOpen;
  };

  /** Manage List **/
  topics: Topic[] = [];
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
      const res = await topicService.fetchTopics({
        q: this.searchQuery,
        perPage: this.perPage,
        page: this.currentPage,
      });

      runInAction(() => {
        this.currentPage = res.data.result.currentPage;
        this.lastPage = res.data.result.lastPage;
        this.count = res.data.result.totalCount;
        this.topics = res.data.result.data;
      });
    } catch (error) {
      console.error(error);
    } finally {
      this.isLoading = false;
    }
  }
}
