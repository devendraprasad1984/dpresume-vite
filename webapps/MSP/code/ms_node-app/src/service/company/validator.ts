import {Checker, Regex} from "fnpm/validators";
import {Hasher} from "fnpm/utils";

import {CompanyCategory, IInfo, IPersonnel} from "ms-npm/company-models";
import {IMemberRequest, MemberRequestType} from "ms-npm/user-models";
import {State} from "ms-npm/base-models";

import {RecordStatus} from "/opt/nodejs/node14/db/enums";

/**
 * Class with validation methods
 */
export abstract class Validator {
    /**
     * Validation of info body
     *
     * @param {IInfo} data info ui model
     * @param {boolean} isUpdate validate if is update or not
     * @returns {boolean} true / false
     */
    static isInfoDataValid(data: Partial<IInfo>, isUpdate: boolean = false): boolean {
        //Validate Info table
        const isCompanyIdValid = isUpdate && data.companyId === undefined ? true : data.companyId > 0;
        const isStatusValid =
            isUpdate && data.status === undefined
                ? true
                : Object.values(RecordStatus).includes(<RecordStatus>data.status);
        const isBioValid = isUpdate && data.bio === undefined ? true : !Checker.isNullOrEmpty(data.bio);
        const isEstablished = isUpdate && data.established === undefined ? true : data.established > 0;
        const isCategoryValid =
            isUpdate && data.category === undefined ? true : Object.values(CompanyCategory).includes(data.category);
        const isNameValid = isUpdate && data.name === undefined ? true : Checker.isStringValid(3, 60, data.name);
        const isCityValid = isUpdate && data.city === undefined ? true : Checker.isStringValid(3, 60, data.city);
        const isStateValid =
            isUpdate && data.state === undefined ? true : Object.values(State).includes(<State>data.state);
        const isFacebookValid =
            Checker.isNullOrEmpty(data.facebook) || Checker.isMatch(Regex.socialMediaLink("facebook"), data.facebook);
        const isInstagramValid =
            Checker.isNullOrEmpty(data.instagram) ||
            Checker.isMatch(Regex.socialMediaLink("instagram"), data.instagram);
        const isLinkedInValid =
            Checker.isNullOrEmpty(data.linkedIn) || Checker.isMatch(Regex.socialMediaLink("linkedin"), data.linkedIn);
        const isTwitterValid =
            Checker.isNullOrEmpty(data.twitter) || Checker.isMatch(Regex.socialMediaLink("twitter"), data.twitter);
        const isWebsiteValid = Checker.isNullOrEmpty(data.website) || Checker.isMatch(Regex.url(), data.website);
        const isVideoValid = Checker.isStringValid(3, 100, data.video, false);
        const isPhotoValid = Checker.isStringValid(3, 100, data.photo, false);

        //Return the result
        return (
            isCompanyIdValid &&
            isStatusValid &&
            isBioValid &&
            isEstablished &&
            isCategoryValid &&
            isNameValid &&
            isFacebookValid &&
            isWebsiteValid &&
            isInstagramValid &&
            isLinkedInValid &&
            isTwitterValid &&
            isVideoValid &&
            isPhotoValid &&
            isCityValid &&
            isStateValid
        );
    }

    /**
     * Validate the create personnel request
     *
     * @param {IPersonnel[]} personnel personnel list
     * @returns {boolean} true / false
     */
    static isCreatePersonnelValid(personnel: IPersonnel[]): boolean {
        if (personnel === undefined) return false;
        if (personnel.length === 1) return personnel[0].companyId > 0 && personnel[0].userId > 0;
        let allPersonnelValid: boolean = true;

        personnel.forEach((p: IPersonnel) => {
            //check the personnel data
            allPersonnelValid = allPersonnelValid && p.companyId > 0 && p.userId > 0;

            //break the validation
            if (!allPersonnelValid) return allPersonnelValid;
        });

        return allPersonnelValid;
    }

    /**
     * Validate the data to create request
     *
     * @param {IMemberRequest} data data for the new member request
     * @param {boolean} isUpdate is a update request
     * @returns {boolean} true / false
     */
    static isMemberRequestValid(data: Partial<IMemberRequest>, isUpdate?: boolean): boolean {
        const isUserRefValid = isUpdate && data.userRef === undefined ? true : Hasher.isGuid(data.userRef);
        const isStatusValid =
            isUpdate && data.status === undefined
                ? true
                : Object.values(RecordStatus).includes(<RecordStatus>data.status);
        const isTypeValid =
            isUpdate && data.type === undefined
                ? true
                : Object.values(MemberRequestType).includes(<MemberRequestType>data.type);
        const isApprovedByValid = Checker.isStringValid(3, 80, data.approvedByRef, false);
        const isTopicRefValid = Checker.isNullOrEmpty(data.topicRef) || Hasher.isGuid(data.topicRef);
        const isSessionRefValid = Checker.isNullOrEmpty(data.sessionRef) || Hasher.isGuid(data.sessionRef);
        const isChannelRefValid = Checker.isNullOrEmpty(data.channelRef) || Hasher.isGuid(data.channelRef);
        const isCompanyRefValid = Checker.isNullOrEmpty(data.companyRef) || Hasher.isGuid(data.companyRef);
        const isRefValueValid =
            isUpdate || this.isRefValueValid(data.topicRef, data.channelRef, data.sessionRef, data.companyRef);
        return (
            isUserRefValid &&
            isStatusValid &&
            isTypeValid &&
            isApprovedByValid &&
            isTopicRefValid &&
            isSessionRefValid &&
            isChannelRefValid &&
            isCompanyRefValid &&
            isRefValueValid
        );
    }

    /**
     * Validate only 1 ref value is filled
     *
     * @param {...string[]} refs user id
     * @returns {boolean} true / false
     */
    static isRefValueValid(...refs: string[]): boolean {
        return refs.filter((ref: string) => !Checker.isNullOrEmpty(ref)).length == 1;
    }
}
