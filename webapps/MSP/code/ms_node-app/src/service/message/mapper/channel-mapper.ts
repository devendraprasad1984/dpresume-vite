import {UtcDate} from "fnpm/utils";

import {ModelMapper} from "ms-npm/model-mapper";
import {IMember, ITopic, ITopicCompany, ITopicMemberRequest, ITopicView, TopicAccess} from "ms-npm/topic-models";
import {IPeopleSearch, ITopicSearch, PeopleConnectedStatus} from "ms-npm/search-models";
import {MemberInclude, MemberRequestInclude, TopicInclude} from "../db.includes";
import {Topic} from "/opt/nodejs/node14/db/client-mysql";
import {RecordStatus} from "/opt/nodejs/node14/db/enums";

/**
 * Model mapper declarations
 */
interface ITopicMapper {
    /**
     * To db Member Request model method declaration
     */
    toDbTopicModel(source: ITopic): Topic;

    /**
     * Map to UI model.
     */
    fromDbTopicModel(source: Topic): ITopic;

    /**
     * Map to DB member.
     */
    toDbNewMember<T>(userId: number, channelId: number, createdBy: string): T;

    /**
     * Map to UI Model
     */
    fromDbTopicSearch(source: TopicInclude, userRef: string): ITopicSearch;
}

/**
 * Model mapper class implementation
 */
export class ChannelMapper extends ModelMapper implements ITopicMapper {
    /**
     * Mapp constructor
     */
    constructor() {
        super();
    }

    /**
     * Mapper method to convert object to Db model
     *
     * @param {ITopic} source source object to be mapped to db model
     * @returns {Topic} mapped db model
     */
    toDbTopicModel(source: Partial<ITopic>): Topic {
        const r: Topic = {
            Id: source.id,
            Access: source.access,
            ChannelRef: source.channelRef,
            CompanyRef: source.companyRef,
            Description: source.description,
            EndedOn: source.endedOn,
            IsHidden: source.isHidden,
            Moderator: source.moderators,
            Picture: source.picture,
            Ref: source.ref,
            Status: source.status,
            Title: source.title,
            CreatedBy: source.audit?.createdBy,
            CreatedOn: <Date>source.audit?.createdOn,
            ModifiedBy: source.audit?.modifiedBy,
            ModifiedOn: <Date>source.audit?.modifiedOn
        };
        return r;
    }

    /**
     * Mapper method to convert object to Db model
     *
     * @param {Topic} source source object to be mapped to db model
     * @returns {ITopic} mapped db model
     */
    fromDbTopicModel(source: Topic): ITopic {
        const r: ITopic = {
            id: source.Id,
            access: <TopicAccess>source.Access,
            channelRef: source.ChannelRef,
            companyRef: source.CompanyRef,
            description: source.Description,
            endedOn: source.EndedOn,
            isHidden: source.IsHidden,
            moderators: <string[]>source.Moderator,
            picture: source.Picture,
            ref: source.Ref,
            status: source.Status,
            title: source.Title,
            audit: {
                createdBy: source.CreatedBy,
                createdOn: source.CreatedOn,
                modifiedBy: source.ModifiedBy,
                modifiedOn: source.ModifiedOn
            }
        };
        return r;
    }

    /**
     * Mapper method to convert data to Db Member model
     *
     * @param {number} userId user id
     * @param {number} channelId channel id
     * @param {string} createdBy create by
     * @returns {T} mapped db model
     */
    toDbNewMember<T>(userId: number, channelId: number, createdBy: string): T {
        const newMember = {
            Id: undefined,
            UserId: userId,
            ChannelId: channelId,
            Status: RecordStatus.Active,
            CreatedBy: createdBy,
            CreatedOn: UtcDate.now(),
            ModifiedBy: undefined,
            ModifiedOn: undefined
        };
        return newMember as unknown as T;
    }

    /**
     * Mapper method to convert object to Db model
     *
     * @param {TopicInclude} source source object to be mapped to db model
     * @returns {ITopicView} mapped db model
     */
    fromDbTopicViewModel(source: TopicInclude): ITopicView {
        const topicCompany: ITopicCompany = {
            id: source.Company?.Id ?? null,
            name: source.Company?.Info[0]?.Name ?? null,
            ref: source.Company?.Info[0]?.Name ?? null
        };

        const topic: ITopicView = {
            id: source.Id,
            ref: source.Ref,
            isHidden: source.IsHidden,
            access: <TopicAccess>source.Access,
            company: topicCompany,
            description: source.Description,
            meetings: null,
            memberRequests: source.MemberRequest.map((mr: MemberRequestInclude) => {
                return <ITopicMemberRequest>{
                    id: mr.Id,
                    user: {
                        firstName: mr.User.Profile[0].FirstName,
                        lastName: mr.User.Profile[0].LastName,
                        picture: mr.User.Profile[0].Pronouns,
                        userRef: mr.UserRef,
                        companyHeadline: mr.User.Profile[0].CompanyHeadline,
                        headline: mr.User.Profile[0].Headline,
                        id: mr.User.Id,
                        pronouns: mr.User.Profile[0].Pronouns,
                        ref: mr.User.Ref
                    },
                    status: mr.Status
                };
            }),
            members: source.Channel.Member.map((m: MemberInclude) => {
                return <IMember>{
                    id: m.User.Id,
                    ref: m.User.Ref,
                    headline: m.User.Profile[0].Headline,
                    companyHeadline: m.User.Profile[0].CompanyHeadline,
                    firstName: m.User.Profile[0].FirstName,
                    lastName: m.User.Profile[0].LastName,
                    picture: m.User.Profile[0].Picture,
                    pronouns: m.User.Profile[0].Pronouns,
                    connectStatus: "notConnected",
                    status: m.Status
                };
            }),
            moderators: null,
            status: source.Status,
            title: source.Title,
            channelRef: source.ChannelRef,
            endedOn: source.EndedOn,
            picture: source.Picture,
            audit: {
                createdBy: source.CreatedBy,
                createdOn: source.CreatedOn,
                modifiedBy: source.ModifiedBy,
                modifiedOn: source.ModifiedOn
            },
            totalMembers: source.Channel.Member.length,
            totalMemberRequest: source.MemberRequest.length,
            totalMeetings: 0,
            connectStatus: PeopleConnectedStatus.NotConnected
        };

        return topic;
    }

    /**
     * Topic Mapper
     *
     * @param {TopicInclude} source source DB object
     * @param {string} userRef userRef
     * @returns {ITopicSearch} topic search UI object
     */
    fromDbTopicSearch(source: TopicInclude, userRef: string): ITopicSearch {
        const arrMembers: MemberInclude[] =
            source.Channel === null ? [] : source.Channel.Member === null ? [] : source.Channel.Member;
        const arrMemberRequest: MemberRequestInclude[] = source.MemberRequest === null ? [] : source.MemberRequest;
        const memberConnected: boolean = arrMembers.some((m: MemberInclude) => m.User.Ref == userRef);
        const memberRequestConnected: boolean = arrMemberRequest.some(
            (mr: MemberRequestInclude) => mr.User.Ref == userRef
        );

        const peopleStatus: PeopleConnectedStatus = memberConnected
            ? PeopleConnectedStatus.Connected
            : memberRequestConnected
                ? PeopleConnectedStatus.Pending
                : PeopleConnectedStatus.NotConnected;

        const map: ITopicSearch = {
            id: source.Id,
            ref: source.Ref,
            access: <TopicAccess>source.Access,
            title: source.Title,
            endedOn: source.EndedOn,
            picture: source.Picture,
            totalMembers: arrMembers === undefined ? 0 : arrMembers.length,
            connectStatus: peopleStatus
        };
        return map;
    }

    /**
     * Mapper method to convert data to Db Member model
     *
     * @param {MemberInclude} source DB information
     * @param {IPeopleSearch[]} connections Users connected with request user
     * @returns {IMember} mapped db model
     */
    fromDBMemberModel(source: MemberInclude, connections: IPeopleSearch[]): IMember {
        const member: IMember = {
            id: source.User.Id,
            companyHeadline: source.User.Profile[0].CompanyHeadline,
            firstName: source.User.Profile[0].FirstName,
            lastName: source.User.Profile[0].LastName,
            headline: source.User.Profile[0].Headline,
            picture: source.User.Profile[0].Picture,
            pronouns: source.User.Profile[0].Pronouns,
            ref: source.User.Ref,
            status: source.User.Status,
            connectStatus: connections.some((p: IPeopleSearch) => p.userId == source.User.Id)
                ? PeopleConnectedStatus.Connected
                : PeopleConnectedStatus.NotConnected
        };
        return member;
    }

    /**
     * Get user connections
     *
     * @param {any} connection Data source object
     * @returns {IPeopleSearch} Return converted data to UI model.
     */
    fromDbConnectionModel(connection: object): IPeopleSearch {
        const userSearch: IPeopleSearch = {
            userId: connection["f0"],
            profileId: connection["f1"],
            role: connection["f2"],
            ref: connection["f3"],
            firstName: connection["f4"],
            lastName: connection["f5"],
            pronouns: connection["f6"],
            headline: connection["f7"],
            companyHeadline: connection["f8"],
            picture: connection["f9"],
            lookingFor: connection["f10"],
            connectStatus: <PeopleConnectedStatus>connection["f11"],
            isOnline: null
        };

        return userSearch;
    }
}
