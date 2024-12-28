import { IPeopleSearch } from "ms-npm/search-models/_/people-search.model";

export interface IPeopleSearchForUI extends IPeopleSearch {
  name: string;
}
