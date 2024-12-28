import { makeAutoObservable, runInAction } from "mobx";

import messageService from "../services/message-service";
import { Conversation } from "../@types/Conversation";
import { SORT_DIRECTIONS } from "../components/data-table/DataTable";

export default class AdminConversationStore {
  constructor() {
    makeAutoObservable(this);
  }

  conversations: Conversation[] = [];
  searchQuery: string;
  perPage = 50;
  currentPage: number = 1;
  lastPage: number;
  count: number;
  sortedColumn: string;
  sortDirection: SORT_DIRECTIONS.ASCENDING | SORT_DIRECTIONS.DESCENDING;
  isLoading: boolean = false;

  resetSearch() {
    this.searchQuery = null;
    this.perPage = 50;
    this.currentPage = 1;
  }

  setSearchQuery(q: string) {
    this.searchQuery = q;
    this.currentPage = 1;
  }

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

  sortResults = (
    name: string,
    direction: SORT_DIRECTIONS.ASCENDING | SORT_DIRECTIONS.DESCENDING
  ) => {
    this.sortedColumn = name;
    this.sortDirection = direction;
    this.goToFirstPage();
  };

  async fetchData() {
    this.isLoading = true;
    try {
      const res = await messageService.fetchConversations({
        q: this.searchQuery,
        perPage: this.perPage,
        page: this.currentPage,
        sortedColumn: this.sortedColumn,
        sortDirection: this.sortDirection,
      });

      runInAction(() => {
        this.currentPage = res.data.result.currentPage;
        this.lastPage = res.data.result.lastPage;
        this.count = res.data.result.totalCount;
        this.conversations = res.data.result.data;
      });
    } catch (error) {
      console.error(error);
    } finally {
      this.isLoading = false;
    }
  }
}
