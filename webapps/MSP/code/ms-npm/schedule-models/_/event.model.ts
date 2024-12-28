import { IAudit } from "../../base-models/_/audit.model";
import { IInvite } from "./event-invitee.model";

/**
 * ISchedule declarations
 */
export interface IEvent {
    id: number;
    ref: string;
    scheduleId: number;
    channelRef: string;
    status: string;
    invitees: IInvite[];
    date: Date | string;
    time: string;
    startedOn: Date | string;
    endOn: Date | string;
    audit: IAudit;
}
