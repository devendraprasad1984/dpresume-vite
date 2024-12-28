import {delay, inject, injectable} from "tsyringe";

import {ApiError} from "fnpm/core";
import {Message, Status} from "fnpm/enums";
import {Hasher, UtcDate} from "fnpm/utils";
import {Chat} from "fnpm/chat";
import {StreamApi} from "fnpm/chat/stream";
import {Meet} from "fnpm/meet";
import {TwilioApi} from "fnpm/meet/twilio";
import {IRoomData} from "fnpm/meet/twilio/models";

import {ISchedule} from "ms-npm/schedule-models";
import {CustomMessageType, IMessageCustom} from "ms-npm/message-models";

import {
    Channel,
    Prisma,
    Meet as dbMeet,
    Schedule,
    Event,
    PrismaClient as MySqlClient
} from "/opt/nodejs/node14/db/client-mysql";
import {RecordStatus} from "/opt/nodejs/node14/db/enums";
import {DbRepo} from "/opt/nodejs/node14/db";
import {IModelSelect, IWhereFilter} from "/opt/nodejs/node14/db/models";

import {MeetMapper} from "../mapper/meet-mapper";
import {UserInclude, MeetInclude} from "../db.includes";
import {UserService} from "../service/user.service";

/**
 * Meet  Service declarations
 */
interface IMeetService {
    // declarations
    /**
     * Retrieve Meet
     *
     * @returns {dbMeet} returns Meet object
     */
    single(filter: Partial<dbMeet>): Promise<dbMeet>;

    /**
     * Returns Room from Twilio
     */
    getRoomByRef(ref: string): Promise<IRoomData>;

    /**
     * Create new room method declaration
     */
    createRoom(channelRef: string, userInfo: UserInclude, message?: string): Promise<string>;

    /**
     * Create schedule room method declaration
     */
    createScheduleRoom(schedule: ISchedule, userRef: string): Promise<string>;
}

/**
 *  Meet service implementation
 */
@injectable()
export class MeetService extends MeetMapper implements IMeetService {
    /**
     * Meet controller constructor
     *
     * @param {Meet<TwilioApi>} meet meet client dependency
     * @param {Meet<StreamApi>} chat chat client dependency
     * @param {DbRepo<MySqlClient>} dbService db client dependency
     * @param {UserService} userService db client dependency
     */
    constructor(
        @inject("Meet") private meet: Meet<TwilioApi>,
        @inject("Chat") private chat: Chat<StreamApi>,
        @inject("Db") private dbService: DbRepo<MySqlClient>,
        @inject(delay(() => UserService)) private userService: UserService
    ) {
        super();
    }

    // methods
    /**
     * Meet retrieve implementation
     *
     * @param {IWhereFilter<dbMeet>} filter  Query params of the wanted Meet
     * @param {IModelSelect} select Retrieved fields on query
     * @returns {dbMeet} return Meet object
     */
    async single(filter?: IWhereFilter<dbMeet>, select?: IModelSelect): Promise<MeetInclude> {
        try {
            return this.dbService.retrieveUnique<MeetInclude>(Prisma.ModelName.Meet, filter, undefined, select);
        } catch (ex) {
            throw new ApiError(Status.Conflict, ex.message);
        }
    }

    /**
     * Return Twilio Room object by ref
     *
     * @param {string} ref Twilio Ref
     * @returns {Promise<IRoomData>} returns Twilio Room Object
     */
    async getRoomByRef(ref: string): Promise<IRoomData> {
        try {
            return await this.meet.client.twilioRoom.findOrCreateRoom(ref);
        } catch (ex) {
            throw new ApiError(Status.Conflict, ex.message);
        }
    }

    /**
     * Create new Room
     *
     * @param {string} channelRef channel REF to send stream message
     * @param {userInfo} userInfo creator user info
     * @param {string?} message specific message that UI wants to send through Stream.
     * @returns {Promise<string>} promise of type string
     */
    async createRoom(channelRef: string, userInfo: UserInclude, message?: string): Promise<string> {
        try {
            //get the data from database
            const filter = {Ref: channelRef};
            const rDBChannel = await this.dbService.retrieveUnique<Channel>(Prisma.ModelName.Channel, filter);
            //check if the channel exist
            if (!rDBChannel) {
                //The channel could not be obtained
                throw new ApiError(Status.Conflict, Message.InvalidData);
            }

            //Send the request to create the room
            const rTwilio: IRoomData = await this.meet.client.twilioRoom.findOrCreateRoom(rDBChannel.Ref);

            //Check the response from Twilio
            if (rTwilio) {
                //check if the room needs to be created in our database
                if (!rTwilio.exist) {
                    //Insert the new record in the database
                    const newDbMeet = super.toDbNewMeetModel<dbMeet>(
                        rDBChannel.Id,
                        rTwilio.sid,
                        rDBChannel.CreatedBy,
                        RecordStatus.Active
                    );
                    //Send the database request to create a new meet.
                    const rDB = await this.dbService.create<dbMeet>(Prisma.ModelName.Meet, newDbMeet);
                    //Check if the meet was created successfully in the database.
                    if (!rDB) {
                        throw new ApiError(Status.Conflict, Message.Conflict);
                    }
                }

                const custom: IMessageCustom = {
                    type: CustomMessageType.InstantVideoCall,
                    createdBy: {
                        id: userInfo.Id,
                        ref: userInfo.Ref,
                        firstName: userInfo.Profile[0].FirstName,
                        lastName: userInfo.Profile[0].LastName
                    },
                    roomId: rTwilio.sid
                };
                //Create the stream format message
                const streamMessage =
                    message !== undefined
                        ? message
                        : `${userInfo.Profile[0].FirstName} ${userInfo.Profile[0].LastName} started a new video call`;
                //Send the stream message
                const rStream = await this.chat.client.streamMessage.send(
                    rDBChannel.StreamRef,
                    streamMessage,
                    undefined,
                    custom
                );
                //Check the response from Stream
                if (rStream) {
                    //Return the Twilio Room SID
                    return rTwilio.sid;
                }
            } else {
                //Return undefined
                return undefined;
            }
        } catch (ex) {
            throw new ApiError(Status.Conflict, ex.message);
        }
    }

    /**
     * Create schedule meeting
     *
     * @param {ISchedule} schedule schedule meeting data
     * @param {string} userRef user ref that creates the request
     * @returns {Promise<string>} promise of type string
     */
    async createScheduleRoom(schedule: ISchedule, userRef: string): Promise<string> {
        try {
            //get the data from database
            const filter = {Ref: schedule.channelRef};
            const rDBChannel = await this.dbService.retrieveUnique<Channel>(Prisma.ModelName.Channel, filter);
            //check if the channel exist
            if (!rDBChannel) {
                //The channel could not be obtained
                throw new ApiError(Status.Conflict, Message.InvalidData);
            }

            //Insert the new record in the database
            const newDbMeet = super.toDbNewMeetModel<dbMeet>(rDBChannel.Id, undefined, userRef, RecordStatus.Pending);
            //Send the database request to create a new meet.
            const rDB = await this.dbService.create<dbMeet>(Prisma.ModelName.Meet, newDbMeet);

            //Check if the meet was created successfully in the database.
            if (rDB && rDB.Id > 0) {
                //Add the schedule
                const newDBSchedule: Schedule = {
                    Id: 0,
                    SessionRef: undefined,
                    MeetRef: newDbMeet.Ref,
                    Status: RecordStatus.Pending,
                    Config: JSON.stringify(schedule.config),
                    IsRecurring: schedule.isRecurring,
                    CreatedBy: userRef,
                    CreatedOn: UtcDate.now(),
                    ModifiedBy: undefined,
                    ModifiedOn: undefined
                };

                //Send the database request to create a new schedule.
                const rDBSchedule = await this.dbService.create<Schedule>(Prisma.ModelName.Schedule, newDBSchedule);

                //Check if the schedule was created successfully in the database.
                if (rDBSchedule && rDBSchedule.Id > 0) {
                    //Add event
                    const newDbEvent: Event = {
                        Id: 0,
                        Ref: Hasher.guid(),
                        ScheduleId: rDBSchedule.Id,
                        ChannelRef: rDBChannel.Ref,
                        Status: RecordStatus.Pending,
                        Invitees: schedule.event[0].invitees,
                        Title: schedule.event[0].title,
                        Date: schedule.event[0].startedOn as Date,
                        Time: schedule.event[0].startedOn as unknown as Date,
                        StartedOn: schedule.event[0].startedOn as Date,
                        EndedOn: schedule.event[0].endedOn as Date,
                        CreatedBy: userRef,
                        CreatedOn: UtcDate.now(),
                        ModifiedBy: undefined,
                        ModifiedOn: undefined
                    };

                    //Send the database request to create a new schedule event.
                    const rDBEvent = await this.dbService.create<Event>(Prisma.ModelName.Event, newDbEvent);

                    //Check if the schedule event was created successfully in the database.
                    if (rDBEvent && rDBEvent.Id > 0) {
                        //get the creator info
                        const userInfo = await this.userService.getUserByRef(userRef);
                        //Create the custom message
                        const custom: IMessageCustom = {
                            type: CustomMessageType.ScheduleVideoCall,
                            createdBy: {
                                id: userInfo.Id,
                                ref: userInfo.Ref,
                                firstName: userInfo.Profile[0].FirstName,
                                lastName: userInfo.Profile[0].LastName
                            },
                            roomId: undefined,
                            eventDetail: {
                                title: schedule.event[0].title,
                                date: schedule.event[0].date as Date,
                                startedOn: schedule.event[0].startedOn as Date,
                                endedOn: schedule.event[0].endedOn as Date
                            }
                        };
                        //Send the message to stream
                        const message = `${userInfo.Profile[0].FirstName} ${userInfo.Profile[0].LastName} schedule a video call`;
                        const rStream = await this.chat.client.streamMessage.send(
                            rDBChannel.StreamRef,
                            message,
                            userRef,
                            custom
                        );
                        //Check the response from Stream
                        if (rStream) {
                            //Return the message
                            return message;
                        }
                    } else {
                        //Return undefined
                        return undefined;
                    }
                } else {
                    //Return undefined
                    return undefined;
                }
            } else {
                //Return undefined
                return undefined;
            }
        } catch (ex) {
            throw new ApiError(Status.Conflict, ex.message);
        }
    }
}
