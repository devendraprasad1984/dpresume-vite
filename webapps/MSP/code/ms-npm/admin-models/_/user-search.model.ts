import { IUser } from "../../user-models/_/user.model";

/**
 *  User search declarations
 */
export interface IUserSearch extends IUser {
    name: string;
    email: string;
    title: string;
    company: string;
    notesCount: number;
}
