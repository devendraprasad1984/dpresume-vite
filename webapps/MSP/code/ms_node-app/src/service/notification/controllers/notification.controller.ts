import {delay, inject, injectable} from "tsyringe";

import {ApiResponse, IApiResponse} from "fnpm/core";
import {Status} from "fnpm/enums";

import {CustomMessageType, IMessageCustom} from "ms-npm/message-models";
import {ModelMapper} from "ms-npm/model-mapper";

import {MessageService} from "../service/message.service";
import {EventService} from "./../service/event.service";
import {MeetService} from "../service/meet.service";
import {UserService} from "../service/user.service";
import {EventInclude} from "../db.includes";

import {RecordStatus} from "/opt/nodejs/node14/db/enums";
import {UtcDate} from "fnpm/utils";

/**
 * Notification Controller declarations
 */
interface INotificationController {
    /**
     * Ping method
     *
     * @returns {Promise<IApiResponse<string>>} promise of type IApiResponse of type string
     */
    ping(): Promise<IApiResponse<string>>;

    /**
     * Notify the pending events
     *
     * @returns {Promise<IApiResponse<boolean>>} promise of type IApiResponse of type boolean
     */
    notifyEvents(): Promise<IApiResponse<boolean>>;
}

/**
 * Notification Controller implementation
 */
@injectable()
export class NotificationController extends ModelMapper implements INotificationController {
    // methods

    /**
     * Notification Controller constructor
     *
     * @param {EventService} eventService event service dependency
     * @param {MessageService} messageService message service dependency
     * @param {MeetService} meetService meet service dependency
     * @param {UserService} userService user service dependency
     */
    constructor(
        @inject(delay(() => EventService)) private eventService: EventService,
        @inject(delay(() => MessageService)) private messageService: MessageService,
        @inject(delay(() => MeetService)) private meetService: MeetService,
        @inject(delay(() => UserService)) private userService: UserService
    ) {
        super();
    }

    /**
     * Ping method implementation
     *
     * @returns {Promise<IApiResponse<string>>} promise of type IApiResponse of type string
     */
    async ping(): Promise<IApiResponse<string>> {
        return new ApiResponse(Status.OK, "notification - ping");
    }

    /**
     * Notify the pending events
     */
    async notifyEvents(): Promise<IApiResponse<boolean>> {
        //TODO Get this values for cache
        const actionMinutes = 10;
        const reminderMinutes = 2880; //two days

        const currentDate = UtcDate.now();
        const actionDate: Date = new Date(currentDate.getTime() + actionMinutes * 60000);
        const reminderDate: Date = new Date(currentDate.getTime() + reminderMinutes * 60000);

        //First Step: Retrieve the events 5 minutes before
        const actionEvents = await this.eventService.getFutureEvents(currentDate, actionDate);

        //Check if we have action events to notify
        if (actionEvents && actionEvents.length > 0) {
            //loop the events to notify the channel
            for (const event of actionEvents) {
                try {
                    //Create the room in Twilio
                    const rTwilio = await this.meetService.createRoom(event.ChannelRef);
                    //Check the response from twilio
                    if (rTwilio) {
                        //update the information of the Meet
                        const rEvent = await this.eventService.updateEvent(
                            event.Id,
                            event.ScheduleId,
                            event.Schedule.MeetRef,
                            rTwilio.sid,
                            RecordStatus.Active
                        );

                        //Check the result of the schedule update
                        const r = rEvent[0] as object;
                        if (r["f0"]) {
                            //Send the message
                            const streamMessage = "Join your video call now";
                            await this.sendStreamMessage(
                                streamMessage,
                                CustomMessageType.ActionScheduleVideoCall,
                                event,
                                rTwilio.sid
                            );
                        }
                    }
                } catch (ex) {
                    /* istanbul ignore next */
                    //next event
                    continue;
                }
            }
        }

        //Second Step: Retrieve the events 2 days before
        //Retrieve the reminder Events
        const reminderEvents = await this.eventService.getFutureEvents(actionDate, reminderDate);

        //Check if we have reminder events to notify
        if (reminderEvents && reminderEvents.length > 0) {
            //loop the events to notify the channel
            for (const event of reminderEvents) {
                try {
                    //Send the message
                    const streamMessage = "You have an upcoming video call";
                    await this.sendStreamMessage(streamMessage, CustomMessageType.ReminderScheduleVideoCall, event);
                } catch (ex) {
                    /* istanbul ignore next */
                    //next event
                    continue;
                }
            }
        }

        return new ApiResponse(Status.OK, true);
    }

    /**
     * Send event message using stream
     *
     * @param {string} streamMessage stream message text
     * @param {CustomMessageType} messageType custom message type
     * @param {EventInclude} event event details
     * @param {string} newRoomId new Twilio room Id, in case is a instant call
     */
    private async sendStreamMessage(
        streamMessage: string,
        messageType: CustomMessageType,
        event: EventInclude,
        newRoomId?: string
    ) {
        //get the creator information
        const userInfo = await this.userService.getUserByRef(event.CreatedBy);
        //Create the custom message
        const custom: IMessageCustom = {
            type: messageType,
            createdBy: {
                id: userInfo.Id,
                ref: userInfo.Ref,
                firstName: userInfo.Profile[0].FirstName,
                lastName: userInfo.Profile[0].LastName
            },
            roomId: newRoomId,
            eventDetail: {
                title: event.Title,
                date: event.Date,
                startedOn: event.StartedOn,
                endedOn: event.EndedOn
            }
        };
        //Send the message
        await this.messageService.sendMessage(event.ChannelRef, streamMessage, event.CreatedBy, custom);
    }
}
