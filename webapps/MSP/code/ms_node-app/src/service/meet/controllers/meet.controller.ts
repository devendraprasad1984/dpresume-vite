import {Hasher} from "fnpm/utils";
import {delay, inject, injectable} from "tsyringe";

import {IApiResponse, ApiResponse, ApiError} from "fnpm/core";
import {Message, Status} from "fnpm/enums";
import {Checker} from "fnpm/validators";
import {IRoomData} from "fnpm/meet/twilio/models";

import {ISchedule} from "ms-npm/schedule-models";
import {IRoom} from "ms-npm/meet-models";

import {Prisma} from "/opt/nodejs/node14/db/client-mysql";
import {IModelSelect, IWhereFilter} from "/opt/nodejs/node14/db/models";

import {MeetService} from "../service/meet.service";
import {Validator} from "../validator";
import {UserService} from "../service/user.service";

import {MeetInclude} from "../db.includes";
import {MeetMapper} from "../mapper/meet-mapper";

/**
 * Meet Controller declarations
 */
interface IMeetController {
    //methods
    /**
     * Ping method
     *
     * @param {Promise<IApiResponse<string>>} promise of type IApiResponse of type string
     */
    ping(): Promise<IApiResponse<string>>;

    /**
     * Get Meet Info
     */
    single(ref: string): Promise<IApiResponse<IRoom>>;

    /**
     * Create new room method
     */
    createRoom(channelRef: string, userRef: string, message?: string): Promise<IApiResponse<string>>;

    /**
     * Create schedule room method
     */
    createScheduleRoom(schedule: ISchedule, userRef: string): Promise<IApiResponse<string>>;
}

/**
 * Schedule Controller implementation
 */
@injectable()
export class MeetController extends MeetMapper implements IMeetController {
    //methods

    /**
     * Meet Controller constructor
     *
     * @param {MeetService} meetService meet service dependency
     * @param {UserService} userService user service dependency
     */
    constructor(
        @inject(delay(() => MeetService)) private meetService: MeetService,
        @inject(delay(() => UserService)) private userService: UserService
    ) {
        super();
    }

    /**
     * Ping method
     *
     * @returns {Promise<IApiResponse<string>>} promise of type IApiResponse of type string
     */
    async ping(): Promise<IApiResponse<string>> {
        return new ApiResponse(Status.OK, "meet - pong");
    }

    /**
     * Returns a Meet object
     *
     * @param {string} ref twilio ref
     * @returns {Promise<IApiResponse<IRoom>>} promise of type IApiResponse of type Meet data
     */
    async single(ref: string): Promise<IApiResponse<IRoom>> {
        try {
            // validate
            if (!Checker.isNullOrEmpty(ref)) {
                const filter: IWhereFilter<Prisma.MeetWhereInput> = {};
                const select: IModelSelect = {
                    Id: true,
                    Ref: true,
                    Channel: {select: {Ref: true}},
                    Status: true,
                    CreatedOn: true,
                    CreatedBy: true,
                    ModifiedOn: true,
                    ModifiedBy: true
                };

                filter.TwilioRef = ref;

                const r: MeetInclude = await this.meetService.single(filter, select);
                let response: IRoom = <IRoom>{};
                if (r) {
                    response = super.fromDBToRoom(r);
                    const twilioRef: IRoomData = await this.meetService.getRoomByRef(ref);
                    if (twilioRef) response.status = twilioRef.status;
                    else throw new ApiError(Status.BadRequest, Message.InvalidData);
                }
                return new ApiResponse(Status.OK, response);
            } else {
                throw new ApiError(Status.BadRequest, Message.InvalidData);
            }
        } catch (ex) {
            throw new ApiError(Status.Conflict, ex.message);
        }
    }

    /**
     * Create a new room in Twilio
     *
     * @param {number} channelRef Channel id that generates the request
     * @param {string} userRef user ref that creates the request
     * @param {string?} message specific message that UI wants to send through Stream.
     * @returns {Promise<IApiResponse<string>>} promise of type IApiResponse of type string
     */
    async createRoom(channelRef: string, userRef: string, message?: string): Promise<IApiResponse<string>> {
        //Validate the create room request
        if (Hasher.isGuid(channelRef)) {
            const userInfo = await this.userService.getUserByRef(userRef);
            //Get the result from the services
            const r: string = await this.meetService.createRoom(channelRef, userInfo, message);
            //Check the result
            if (r) {
                //Token retrieve successfully
                return new ApiResponse(Status.OK, r);
            } else {
                //Conflict to create the room
                throw new ApiError(Status.Conflict, Message.Failure);
            }
        } else {
            throw new ApiError(Status.BadRequest, Message.InvalidData);
        }
    }

    /**
     * Create a schedule room in Twilio
     *
     * @param {ISchedule} schedule schedule meet data the request
     * @param {string} userRef user ref that creates the request
     * @returns {Promise<IApiResponse<string>>} promise of type IApiResponse of type string
     */
    async createScheduleRoom(schedule: ISchedule, userRef: string): Promise<IApiResponse<string>> {
        //Validate the create room request
        if (Validator.isScheduleMeetDataValid(schedule)) {
            //Get the result from the services
            const r: string = await this.meetService.createScheduleRoom(schedule, userRef);

            //Check the result
            if (r) {
                //Token retrieve successfully
                return new ApiResponse(Status.OK, r);
            } else {
                //Conflict to create the room
                throw new ApiError(Status.Conflict, Message.Failure);
            }
        } else {
            throw new ApiError(Status.BadRequest, Message.InvalidData);
        }
    }
}
