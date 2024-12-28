import {inject, injectable} from "tsyringe";

import {ApiError} from "fnpm/core";
import {Status} from "fnpm/enums";
import {EventInclude} from "../db.includes";

import {DbRepo} from "/opt/nodejs/node14/db";
import {Prisma, PrismaClient as MySqlClient} from "/opt/nodejs/node14/db/client-mysql";
import {RecordStatus} from "/opt/nodejs/node14/db/enums";

/**
 *  Event Notification Service declarations
 */
interface IEventService {
    // declarations

    /**
     * Send a message through a specific channel
     */
    getFutureEvents(currentDate: Date, futureDate: Date): Promise<EventInclude[]>;

    /**
     * Update a specific event and associated tables
     */
    updateEvent(eventId: number, scheduleId: number, meetRef: string, twilioRef: string, status: string);
}

/**
 * Event service implementation
 */
@injectable()
export class EventService implements IEventService {
    /**
     * Event service constructor
     *
     @param {DbRepo<MySqlClient>} dbService db client dependency
     */
    constructor(@inject("Db") private dbService: DbRepo<MySqlClient>) {
    }

    // methods

    /**
     * Send a message through a specific channel
     *
     * @param {Date} currentDate current date
     * @param {Date} futureDate future date
     * @returns {Promise<EventInclude[]>} promise of type EventInclude[]
     */
    async getFutureEvents(currentDate: Date, futureDate: Date): Promise<EventInclude[]> {
        try {
            //create the filter
            const filter = {StartedOn: {gte: currentDate, lte: futureDate}, Status: RecordStatus.Pending};

            //Create the include model
            const eventModel = {[Prisma.ModelName.Schedule]: {include: {[Prisma.ModelName.Meet]: true}}};

            //return the events
            return this.dbService.retrieve<EventInclude>(Prisma.ModelName.Event, filter, eventModel);
        } catch (ex) {
            throw new ApiError(Status.Conflict, ex.Message);
        }
    }

    /**
     * Update a specific event and associated tables
     *
     * @param {number} eventId event id
     * @param {number} scheduleId schedule id
     * @param {string} meetRef meet ref id
     * @param {string} twilioRef twilio ref id
     * @param {string} status status that we want to set to the records
     * @returns {Promise<number>} Return promise of number
     */
    async updateEvent(
        eventId: number,
        scheduleId: number,
        meetRef: string,
        twilioRef: string,
        status: string
    ): Promise<number> {
        try {
            return await this.dbService
                .rawQuery`CALL sp_updateScheduleEvents(${eventId}, ${scheduleId}, ${meetRef}, ${twilioRef}, ${status})`;
        } catch (ex) {
            throw new ApiError(Status.Conflict, ex.message);
        }
    }
}
