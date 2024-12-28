import {Hasher} from "fnpm/utils";
import {Checker} from "fnpm/validators";

import {IEvent, ISchedule} from "ms-npm/schedule-models";

/**
 * Class with validation methods
 */
export abstract class Validator {
    /**
     * Validate schedule meeting data request
     *
     * @param {ISchedule} schedule schedule meet
     * @returns {boolean} true / false
     */
    static isScheduleMeetDataValid(schedule: ISchedule): boolean {
        const isRecurringValid = schedule.isRecurring === undefined ? false : true;
        const eventsAreValid = this.areEventsDataValid(schedule.event);
        return Hasher.isGuid(schedule.channelRef) && isRecurringValid && eventsAreValid;
    }

    /**
     * Check the events list in a schedule meeting
     *
     * @param {IEvent[]} events events list
     * @returns {boolean} true / false
     */
    static areEventsDataValid(events: IEvent[]): boolean {
        if (events === undefined) return false;
        let allEventsValid: boolean = true;
        if (events.length > 0) {
            events.forEach((u: IEvent) => {
                allEventsValid = allEventsValid && this.isEventValid(u);
                //break the validation
                if (!allEventsValid) return allEventsValid;
            });
        } else {
            allEventsValid = false;
        }
        return allEventsValid;
    }

    /**
     * Check Event Data
     *
     * @param {IEvent} event event data
     * @returns {boolean} true / false
     */
    private static isEventValid(event: IEvent): boolean {
        const isTitleValid = !Checker.isNullOrEmpty(event.title);
        const isStartedValid = !Checker.isNullOrEmpty(event.startedOn.toString());
        const isEndValid = !Checker.isNullOrEmpty(event.endedOn.toString());
        const isInviteesValid = this.isInviteesValid(event.invitees);
        return isTitleValid && isStartedValid && isEndValid && isInviteesValid;
    }

    /**
     * Check Invitees Data
     *
     * @param {string[]} invitees invitees data
     * @returns {boolean} true / false
     */
    private static isInviteesValid(invitees: string[]): boolean {
        if (invitees === undefined) return false;
        let allInvitesValid: boolean = true;
        if (invitees.length > 1) {
            invitees.forEach((i: string) => {
                //check the id user of the invitee
                allInvitesValid = allInvitesValid && Hasher.isGuid(i);
                //break the validation
                if (!allInvitesValid) return allInvitesValid;
            });
        } else {
            allInvitesValid = false;
        }
        return allInvitesValid;
    }
}
