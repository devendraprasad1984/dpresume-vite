import { IPersonnelSearch } from "ms-npm/company-models";

export interface IPersonnelSearchForUI extends IPersonnelSearch {
  user: IPersonnelSearch["user"] & {
    name: string;
  };
}
