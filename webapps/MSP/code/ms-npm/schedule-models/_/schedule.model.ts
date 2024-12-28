import { IAudit } from "../../base-models";
import { IEvent } from "./event.model";
import { IScheduleConfig } from "./schedule-config.model";

/**
 * ISchedule declarations
 */
export interface ISchedule {
    id: number;
    sessionRef?: string;
    meetRef?: string;
    channelId: number;
    status: string;
    isRecurring: boolean;
    config: IScheduleConfig;
    audit: IAudit;
    event?: IEvent[];
}
