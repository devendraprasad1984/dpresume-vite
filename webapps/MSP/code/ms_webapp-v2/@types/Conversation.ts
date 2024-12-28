import { IUserSearch } from "ms-npm/admin-models";

export interface Conversation {
  id: number;
  name: string;
  message: string;
  date: string;
  status: string;
  messageStatus: string;
  notesCount: number;
  user: IUserSearch;
}

export interface CustomStreamData {
  createdBy?: {
    firstName?: string;
    lastName?: string;
    id?: number;
    ref?: string;
  };
  roomId?: string;
  type?: string;
}

export interface IBaseMember {
  id: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  headline?: string;
  companyHeadline?: string;
  pronouns?: string;
  role?: string;
  banned?: string;
  online?: boolean;
  picture?: string;
}

export type IChannelUser = IBaseMember;

export interface IMember extends IBaseMember {
  user?: IChannelUser;
  inChannel?: boolean;
}

export interface IChatProps {
  id: string;
  user?: string;
  text: string;
  html?: string;
  datetime: string;
}

export interface IEventVideoCall {
  title: string;
  startedOn: string;
  endedOn: string;
  invitees: string[];
}

export interface IScheduleVideoCallBody {
  channelRef: string;
  isRecurring: boolean;
  event: IEventVideoCall[];
}
