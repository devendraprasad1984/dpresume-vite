import {delay, inject, injectable} from "tsyringe";
import {User as StreamUser} from "stream-chat";
import {readFileSync} from "fs";

import {ApiResponse, ApiError, IApiResponse} from "fnpm/core";
import {EncryptionType, Message, Status} from "fnpm/enums";
import {Hasher, UtcDate, Encryptor, Encoder} from "fnpm/utils";
import {ChannelType} from "fnpm/chat/stream/enum";
import {Checker} from "fnpm/validators";

import {Role, IAuthResponse, IUserIdentity, IMetadata, MSRole, IAuthRulesBase, Section} from "ms-npm/auth-models";
import {CustomChannelType, IChannelMember} from "ms-npm/message-models";
import {IUserAuthRules} from "ms-npm/auth-models";

import {IConfig} from "/opt/nodejs/node14/config";
import {User, GroupMember, Profile} from "/opt/nodejs/node14/db/client-mysql";
import {RecordStatus} from "/opt/nodejs/node14/db/enums";

import {AuthMapper} from "../mapper/auth-mapper";
import {AuthService} from "../service/auth.service";
import {AuthZeroService, IAuthZeroUser} from "../service/auth-zero.service";
import {ChannelService} from "../service/channel.service";
import {GroupMemberService} from "../service/group-member.service";
import {UserCreate} from "../db.includes";
import {UserService} from "../service/user.service";
import {ProfileService} from "../service/profile.service";

/**
 * Auth Controller declarations
 */
interface IAuthController {
    /**
     * Ping method
     *
     * @returns {Promise<IApiResponse<string>>} promise of type IApiResponse of type string
     */
    ping(): Promise<IApiResponse<string>>;

    /**
     * Authenticate method declaration
     *
     * @param {string} accessToken auth0 auth header access token
     * @returns {Promise<IApiResponse<IAuthResponse>>} Api response of IAuthResponse
     */
    authenticate(accessToken: string): Promise<IApiResponse<IAuthResponse>>;
}

/**
 * Auth Controller implementation
 */
@injectable()
export class AuthController extends AuthMapper implements IAuthController {
    //properties
    private _config: IConfig;

    /**
     * Auth Controller constructor
     *
     * @param {AuthService} authService auth service dependency
     * @param {AuthZeroService} auth0 auth zero service dependency
     * @param {ChannelService} channelService stream channel dependency
     * @param {GroupMemberService} groupMemberService GroupMember service dependency
     * @param {UserService} userService User service dependency
     * @param {ProfileService} profileService Profile service dependency
     */
    constructor(
        @inject(delay(() => AuthService)) private authService: AuthService,
        @inject(delay(() => AuthZeroService)) private auth0: AuthZeroService,
        @inject(delay(() => ChannelService)) private channelService: ChannelService,
        @inject(delay(() => GroupMemberService)) private groupMemberService: GroupMemberService,
        @inject(delay(() => UserService)) private userService: UserService,
        @inject(delay(() => ProfileService)) private profileService: ProfileService
    ) {
        super();
    }

    //getters and setters
    /**
     * Config getter
     *
     * @returns {IConfig} merged config object
     */
    get config(): IConfig {
        /* istanbul ignore next */
        return this._config;
    }

    /**
     * Config setter
     */
    set config(value: IConfig) {
        this._config = value;
    }

    // methods

    /**
     * Ping method implementation
     *
     * @returns {Promise<IApiResponse<string>>} promise of type IApiResponse of type string
     */
    async ping(): Promise<IApiResponse<string>> {
        return new ApiResponse(Status.OK, "auth - pong");
    }

    /**
     * Sign up method.
     *
     * @param {string} accessToken auth0 auth header access token
     * @returns {Promise<IApiResponse<User>>} promise of type IApiResponse of type User
     */
    async authenticate(accessToken: string): Promise<IApiResponse<IAuthResponse>> {
        // verify user info against auth0 using access token
        const authZeroUser: IAuthZeroUser = await this.auth0.getUserInfo(this._config.auth.domain, accessToken);

        if (authZeroUser) {
            // get user from db by "sub"
            const filterUser: Partial<User> = {Sub: authZeroUser.sub};
            let user: User = await this.authService.singleUser(filterUser);
            let initialized = false;

            if (!user) {
                // create user
                const userRef: string = Hasher.guid();
                const userData: UserCreate = {
                    Id: 0,
                    Ref: userRef,
                    Status: RecordStatus.Active,
                    Role: Role.User,
                    Sub: authZeroUser.sub,
                    LastLogin: UtcDate.now(),
                    CreatedOn: UtcDate.now(),
                    CreatedBy: userRef,
                    ModifiedOn: null,
                    ModifiedBy: null,
                    Profile: {
                        create: {
                            Ref: Hasher.guid(),
                            Status: RecordStatus.Pending,
                            Ethnicity: "",
                            LookingFor: "",
                            CreatedBy: userRef,
                            CreatedOn: UtcDate.now(),
                            YearsExperience: "",
                            FirstName: authZeroUser?.given_name === undefined ? "" : authZeroUser?.given_name,
                            LastName: authZeroUser?.family_name === undefined ? "" : authZeroUser?.family_name,
                            Email: authZeroUser?.email === undefined ? "" : authZeroUser?.email,
                            PhoneNumber: "",
                            IsAppMessagingAllowed: false,
                            IsPushNotificationAllowed: false
                        }
                    }
                };
                const newUser = await this.authService.createUser(userData);

                // check if user is created
                if (!newUser) {
                    throw new ApiError(Status.Conflict, Message.Conflict);
                }

                user = <User>newUser;
                initialized = true;
            }

            // check for status , must be active to login
            if (user.Status != RecordStatus.Active) {
                throw new ApiError(Status.Unauthorized, Message.Unauthorized);
            }

            // update login info
            const updateData: Partial<User> = {Sub: authZeroUser.sub, LastLogin: UtcDate.now()};
            await this.authService.updateLoginInfo(user.Id, updateData);

            // check onboarding status
            const onboardingStatus = await this.getOnboardingStatus(user.Id);

            // set auth response
            const res: IAuthResponse = this.generateAuthResponse(user, accessToken, initialized, onboardingStatus);

            // return IAuthResponse
            return new ApiResponse(Status.OK, res);
        } else {
            throw new ApiError(Status.Unauthorized, Message.Unauthorized);
        }
    }

    /**
     * Create MS:1 Channel for registered user
     *
     * @param {string} userRef user ref / guid
     * @returns {Promise<IApiResponse<boolean>>} boolean as promise
     */
    async createMsGroupChannel(userRef: string): Promise<IApiResponse<boolean>> {
        if (Hasher.isGuid(userRef)) {
            //Get MS Users (MSA, MSC Roles) from GroupMember
            const groupMember: GroupMember[] = await this.groupMemberService.filter({
                CompanyRef: null,
                IsDefault: true
            });

            const streamUsers: StreamUser[] = [];

            streamUsers.push({
                id: groupMember[0].Ref,
                name: groupMember[0].Name,
                role: Role.User.toLocaleLowerCase()
            });

            const rUser: boolean = await this.channelService.registerStreamUser(streamUsers);

            if (!rUser) {
                return new ApiResponse(Status.Conflict, false);
            }

            //Get the user information
            const user = await this.userService.getUserByRef(userRef);
            const isChannelCreated = await this.userService.msChannelCreated(user.Id, groupMember[0].Ref);
            //Channel is already created
            if (isChannelCreated) {
                return new ApiResponse(Status.OK, isChannelCreated);
            }
            const userName = `${user.Profile[0].FirstName} ${user.Profile[0].LastName}`;
            //Create array of members
            const members: IChannelMember[] = [
                {
                    name: groupMember[0].Name,
                    ref: groupMember[0].Ref,
                    id: 0
                },
                {
                    name: userName,
                    ref: userRef,
                    id: user.Id
                }
            ];

            //Create group name
            const groupName = `${groupMember[0].Name}, ${userName}`;

            //Generate channelId for Stream
            const channelId = Hasher.guid();
            //Create the channel.
            const rChannel = await this.channelService.createChannel(
                ChannelType.Team,
                groupName,
                groupMember[0].Ref,
                CustomChannelType.OneToMS,
                channelId
            );
            //Check if the channel was created successfully
            if (rChannel?.channelId !== undefined) {
                //Add the channel members
                const rMembers = await this.channelService.addMembers(
                    rChannel.channelId,
                    members,
                    rChannel.channelRef,
                    rChannel.channel.id,
                    `Welcome to MS Channel` //TODO Define default invite message
                );
                //Check if the members were added successfully
                if (rMembers) {
                    //Send the response to UI
                    return new ApiResponse(Status.OK, true);
                } else {
                    /* istanbul ignore next */
                    //Delete the channel in stream and database
                    await this.channelService.deleteChannel(rChannel.channelId, true);

                    /* istanbul ignore next */
                    //Throw the exception
                    throw new ApiError(Status.Conflict, Message.Failure);
                }
            } else {
                throw new ApiError(Status.Conflict, Message.Failure);
            }
        } else {
            throw new ApiError(Status.BadRequest, Message.InvalidData);
        }
    }

    /**
     * Create Auth Response
     *
     * @param {User} user user data
     * @param {string} accessToken auth zero access token
     * @param {boolean} initialized user generated/initialized flag
     * @param {boolean} onboarded user onboarding status
     * @returns {IAuthResponse} auth response
     */
    private generateAuthResponse(
        user: User,
        accessToken: string,
        initialized: boolean,
        onboarded: boolean
    ): IAuthResponse {
        const userIdentity: IUserIdentity = {id: user.Id, ref: user.Ref, role: user.Role};
        const metadata: IMetadata = {user: userIdentity};

        const accessTokenSegments: string[] = accessToken.split(".");
        const key: string = accessTokenSegments[accessTokenSegments.length - 1];
        const secureData: string = Encryptor.encrypt(EncryptionType.AES, JSON.stringify(metadata), key);

        return {
            metadata: Encoder.toBase64(secureData),
            initialized: initialized,
            onboarded: onboarded,
            auth: this.generateUserAuthRules(user.Role as Role | MSRole)
        } as IAuthResponse;
    }

    /**
     * Create auth rules for authenticated user
     *
     * @param {Role|MSRole} role authenticated user role
     * @returns {IUserAuthRules} authenticated user authorization rules
     */
    private generateUserAuthRules(role: Role | MSRole): IUserAuthRules {
        const dir: string = `${__dirname}`;
        const root: string = dir.substring(0, dir.indexOf("auth"));
        const path: string = `${root}/auth/authorization-rules.json`;
        const authRules: IAuthRulesBase = JSON.parse(readFileSync(path, "utf-8"));

        const userRules: Map<Section, string> = new Map<Section, string>();

        Object.keys(authRules.Rules).forEach((section: string) => {
            userRules[section] = authRules.Rules[section][role];
        });

        return userRules as unknown as IUserAuthRules;
    }

    /**
     * Check onboarding status for the user
     *
     * @param {number} id user id
     * @returns {Promise<boolean>} onboarding status as boolean promise
     */
    private async getOnboardingStatus(id: number): Promise<boolean> {
        if (id > 0) {
            const filter: Partial<Profile> = {UserId: id};
            const res: Profile[] = await this.profileService.filter(filter);

            const profile = res.length > 0 ? res[0] : undefined;

            if (profile) {
                const onboardedLookingFor: boolean = !Checker.isNullOrEmpty(profile.LookingFor);
                const onboardedWithName: boolean =
                    !Checker.isNullOrEmpty(profile.FirstName) && !Checker.isNullOrEmpty(profile.LastName);

                const onboardedWithHeadlines: boolean =
                    !Checker.isNullOrEmpty(profile.Headline) && !Checker.isNullOrEmpty(profile.CompanyHeadline);

                return onboardedLookingFor && onboardedWithName && onboardedWithHeadlines;
            } else {
                throw new ApiError(Status.Conflict, Message.Conflict);
            }
        } else {
            throw new ApiError(Status.BadRequest, Message.InvalidData);
        }
    }
}
