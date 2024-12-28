import {Checker, Regex} from "fnpm/validators";
import {Hasher} from "fnpm/utils";

import {ITag, ITagList, State, TagCategory, TagType} from "ms-npm/base-models";
import {
    IBasicInfo,
    IBio,
    IEducationHistory,
    IMSPshipObjective,
    IPersonalData,
    IPrivateContactInfo,
    IProfile,
    IPublicContactInfo,
    IWorkHistory
} from "ms-npm/profile-models";
import {IMemberRequest, IUser, MemberRequestType} from "ms-npm/user-models";

import {RecordStatus} from "/opt/nodejs/node14/db/enums";

/**
 * Class with validation methods
 */
export abstract class Validator {
    /**
     * Validate the data for a create request
     *
     * @param {IUser} data data for the new user
     * @returns {boolean} true / false
     */
    static isUpdateUserDataValid(data: Partial<IUser>): boolean {
        if (data.role !== undefined && data.role === null) {
            return false;
        }

        if (data.status !== undefined && data.status === null) {
            return false;
        }

        return true;
    }

    /**
     * Validate the data for a create request
     *
     * @param {IProfile} data data for the new profile
     * @param {boolean} isUpdate is a update request
     * @returns {boolean} true / false
     */
    static isProfileDataValid(data: IProfile, isUpdate: boolean = false): boolean {
        //Validate Profile table
        const profileBaseDataValid =
            this.isUserIdValid(data.userId, isUpdate) && this.isStatusValid(data.status, isUpdate);
        const basicInfoDataValid = this.isBasicInfoValid(data.basicInfo, isUpdate);
        const bioDataValid = this.isBioValid(data.bio);
        const publicContactInfoValid = this.isPublicContactValid(data.publicContactInfo);
        const privateContactInfoValid = this.isPrivateContactValid(data.privateContactInfo, isUpdate);
        const personalDataValid = this.isPersonalDataValid(data.personalData, isUpdate);
        const MSPshipObjectivesValid = this.isMSPshipObjectivesValid(data.MSPshipObjectives, isUpdate);

        //Return the result
        return (
            profileBaseDataValid &&
            basicInfoDataValid &&
            bioDataValid &&
            publicContactInfoValid &&
            privateContactInfoValid &&
            personalDataValid &&
            MSPshipObjectivesValid
        );
    }

    /**
     * Validate the data for create request
     *
     * @param {IWorkHistory} data data for the new work history
     * @param {boolean} isUpdate is a update request
     * @returns {boolean} true / false
     */
    static isWorkHistoryDataValid(data: IWorkHistory, isUpdate?: boolean): boolean {
        const isProfileIdValid = isUpdate && data.profileId === undefined ? true : data.profileId > 0;
        const isStatusIdValid =
            isUpdate && data.status === undefined ? true : this.isStatusValid(data.status, isUpdate);
        const isCompanyValid =
            isUpdate && data.company === undefined ? true : Checker.isStringValid(1, 100, data.company);
        const isTitleValid =
            isUpdate && data.title === undefined ? true : Checker.isStringValid(1, 80, data.title, false);
        const isValidStartedOn =
            isUpdate && data.startedOn === undefined ? true : !Checker.isNullOrEmpty(data.startedOn.toString());

        let isCurrentValidation = isUpdate && data.isCurrent === undefined ? true : data.isCurrent;
        let isValidEndedOn = true;
        if (!isCurrentValidation) {
            isValidEndedOn = data.endedOn === undefined ? false : !Checker.isNullOrEmpty(data.endedOn.toString());
            if (isValidEndedOn) isCurrentValidation = true;
        }

        return (
            isProfileIdValid &&
            isStatusIdValid &&
            isCompanyValid &&
            isTitleValid &&
            isValidStartedOn &&
            isCurrentValidation &&
            isValidEndedOn
        );
    }

    /**
     * Validate the data for create request
     *
     * @param {IEducationHistory} data data for the new education history
     * @param {boolean} isUpdate is a update request
     * @returns {boolean} true / false
     */
    static isEducationHistoryDataValid(data: IEducationHistory, isUpdate?: boolean): boolean {
        const isProfileIdValid = isUpdate && data.profileId === undefined ? true : data.profileId > 0;
        const isStatusIdValid =
            isUpdate && data.status === undefined ? true : this.isStatusValid(data.status, isUpdate);
        const isSchoolValid = isUpdate && data.school === undefined ? true : Checker.isStringValid(1, 100, data.school);
        const isDegreeValid =
            isUpdate && data.degree === undefined ? true : Checker.isStringValid(1, 80, data.degree, false);
        const isValidStartedOn =
            isUpdate && data.startedOn === undefined ? true : !Checker.isNullOrEmpty(data.startedOn.toString());

        let isCurrentValidation = isUpdate && data.isCurrent === undefined ? true : data.isCurrent;
        let isValidEndedOn = true;
        if (!isCurrentValidation) {
            isValidEndedOn = data.endedOn === undefined ? false : !Checker.isNullOrEmpty(data.endedOn.toString());
            if (isValidEndedOn) isCurrentValidation = true;
        }

        return (
            isProfileIdValid &&
            isStatusIdValid &&
            isSchoolValid &&
            isDegreeValid &&
            isValidStartedOn &&
            isCurrentValidation &&
            isValidEndedOn
        );
    }

    /**
     * Validate the data for create request
     *
     * @param {IMemberRequest} data data for the new education history
     * @param {boolean} isUpdate is a update request
     * @returns {boolean} true / false
     */
    static isMemberRequestValid(data: IMemberRequest, isUpdate?: boolean): boolean {
        const isUserRefValid = isUpdate && data.userRef === undefined ? true : Hasher.isGuid(data.userRef);
        const isStatusValid = isUpdate && data.status === undefined ? true : this.isStatusValid(data.status, isUpdate);
        const isTypeValid =
            isUpdate && data.type === undefined
                ? true
                : Object.values(MemberRequestType).includes(<MemberRequestType>data.type);
        const isApprovedByValid = Checker.isStringValid(3, 80, data.approvedByRef, false);
        const isTopicRefValid = Checker.isNullOrEmpty(data.topicRef) || Hasher.isGuid(data.topicRef);
        const isSessionRefValid = Checker.isNullOrEmpty(data.sessionRef) || Hasher.isGuid(data.sessionRef);
        const isChannelRefValid = Checker.isNullOrEmpty(data.channelRef) || Hasher.isGuid(data.channelRef);
        const isCompanyRefValid = Checker.isNullOrEmpty(data.companyRef) || Hasher.isGuid(data.companyRef);
        const isRefValueValid = this.isRefValueValid(data.topicRef, data.channelRef, data.sessionRef, data.companyRef);
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

    /**
     * Validate the user id value and type
     *
     * @param {number} userId user id
     * @param {boolean} isUpdate is update operation
     * @returns {boolean} true / false
     */
    static isUserIdValid(userId: number, isUpdate: boolean): boolean {
        // validate id
        // different of 0
        // required
        // numeric

        if (isUpdate && userId === undefined) return true;

        return userId > 0;
    }

    /**
     * Validate status
     *
     * @param {string} status status
     * @param {boolean} isUpdate is update operation
     * @returns {boolean} true / false
     */
    static isStatusValid(status: string, isUpdate: boolean): boolean {
        // Is a valid enum value

        //If is an update and the value is undefined we don't need validation
        if (isUpdate && status === undefined) return true;

        //validate the property
        return Object.values(RecordStatus).includes(status as RecordStatus);
    }

    /**
     * Validate if we need to update the user info in stream
     *
     * @param {string} info user info
     * @returns {boolean} true / false
     */
    static isUpdateStream(info: IBasicInfo): boolean {
        if (info === undefined) return undefined;
        const isFirstNameUpdate = info.firstName === undefined ? false : true;
        const isLastNameUpdate = info.lastName === undefined ? false : true;
        const isPronounsUpdate = info.pronouns === undefined ? false : true;
        const isHeadLineUpdate = info.headline === undefined ? false : true;
        const isCompanyUpdate = info.companyHeadline === undefined ? false : true;
        const isPictureUpdate = info.picture === undefined ? false : true;

        return (
            isFirstNameUpdate ||
            isLastNameUpdate ||
            isPronounsUpdate ||
            isHeadLineUpdate ||
            isCompanyUpdate ||
            isPictureUpdate
        );
    }

    /**
     * Validate the basic info values and types
     *
     * @param {IBasicInfo} basicInfo basic info data
     * @param {boolean} isUpdate is update operation
     * @returns {boolean} true / false
     */
    private static isBasicInfoValid(basicInfo: IBasicInfo, isUpdate: boolean): boolean {
        if (basicInfo === undefined) {
            return true;
        }
        //FirstName
        //Not empty
        //Min 1-60
        const isFirstNameValid =
            isUpdate && basicInfo.firstName === undefined ? true : Checker.isStringValid(1, 60, basicInfo.firstName);

        //LastName
        //Not empty
        //Min 1-60
        const isLastNameValid =
            isUpdate && basicInfo.lastName === undefined ? true : Checker.isStringValid(1, 60, basicInfo.lastName);

        //Pronouns
        //Optional
        //Min 1-25
        const isPronounsValid = Checker.isStringValid(1, 25, basicInfo.pronouns, false);

        //Headline
        //Optional
        //Min 1-60
        const isHeadlineValid =
            isUpdate && basicInfo.headline === undefined ? true : Checker.isStringValid(1, 60, basicInfo.headline);

        //CompanyHeadline
        //Optional
        //Min 1-60
        const isCompanyHeadline =
            isUpdate && basicInfo.companyHeadline === undefined
                ? true
                : Checker.isStringValid(1, 60, basicInfo.companyHeadline);

        //Picture
        //Optional
        //Min 1-500
        const isPictureValid = Checker.isStringValid(1, 500, basicInfo.picture, false);

        //City
        //Optional
        //Min 1-60
        const isCityValid =
            isUpdate && basicInfo.city === undefined ? true : Checker.isStringValid(1, 60, basicInfo.city);

        //State
        //Optional
        //Min 1-60
        const isStateValid =
            isUpdate && basicInfo.state === undefined ? true : Object.values(State).includes(<State>basicInfo.state);

        //Return the result
        return (
            isFirstNameValid &&
            isLastNameValid &&
            isPronounsValid &&
            isHeadlineValid &&
            isCompanyHeadline &&
            isPictureValid &&
            isCityValid &&
            isStateValid
        );
    }

    /**
     * Validate the bio values and types
     *
     * @param {IBio} bio basic info data
     * @returns {boolean} true / false
     */
    private static isBioValid(bio: IBio): boolean {
        if (bio === undefined) {
            return true;
        }
        //Intro
        //Optional
        //Min 3-60
        const isBioIntroValid = Checker.isStringValid(1, 100, bio.intro, false);

        //Text
        //Optional
        //Min 3-250
        const isBioTextValid = Checker.isStringValid(1, 500, bio.text, false);

        //Return the result
        return isBioIntroValid && isBioTextValid;
    }

    /**
     * Validate the public contact info values and types
     *
     * @param {IPublicContactInfo} publicContactInfo public contact info data
     *  @returns {boolean} true / false
     */
    private static isPublicContactValid(publicContactInfo: IPublicContactInfo): boolean {
        if (publicContactInfo === undefined) {
            return true;
        }
        //Website
        //Optional
        //Min 3-150
        const isWebsiteValid =
            Checker.isNullOrEmpty(publicContactInfo.website) || Checker.isMatch(Regex.url(), publicContactInfo.website);
        const isFacebookValid =
            Checker.isNullOrEmpty(publicContactInfo.facebook) ||
            Checker.isMatch(Regex.socialMediaLink("facebook"), publicContactInfo.facebook);
        const isInstagramValid =
            Checker.isNullOrEmpty(publicContactInfo.instagram) ||
            Checker.isMatch(Regex.socialMediaLink("instagram"), publicContactInfo.instagram);
        const isLinkedInValid =
            Checker.isNullOrEmpty(publicContactInfo.linkedin) ||
            Checker.isMatch(Regex.socialMediaLink("linkedin"), publicContactInfo.linkedin);
        const isTwitterValid =
            Checker.isNullOrEmpty(publicContactInfo.twitter) ||
            Checker.isMatch(Regex.socialMediaLink("twitter"), publicContactInfo.twitter);

        //Return the result
        return isWebsiteValid && isLinkedInValid && isFacebookValid && isInstagramValid && isTwitterValid;
    }

    /**
     * Validate the private contact info values and types
     *
     * @param {IPrivateContactInfo} privateContactInfo private contact info data
     * @param {boolean} isUpdate is update operation
     * @returns {boolean} true / false
     */
    private static isPrivateContactValid(privateContactInfo: IPrivateContactInfo, isUpdate: boolean): boolean {
        if (privateContactInfo === undefined) {
            return true;
        }
        //Email
        //Not empty
        //Min 10-80
        const isEmailValid =
            isUpdate && privateContactInfo.email === undefined
                ? true
                : Checker.isStringValid(1, 320, privateContactInfo.email);
        const isEmailFormatValid: boolean =
            isUpdate && privateContactInfo.email === undefined
                ? true
                : Checker.isMatch(Regex.emailAddress(), privateContactInfo.email);

        //Phone
        //Not empty
        //Min 15
        const isPhoneValid =
            isUpdate && privateContactInfo.phone === undefined
                ? true
                : Checker.isStringValid(1, 15, privateContactInfo.phone);
        const isPhoneFormatValid: boolean =
            isUpdate && privateContactInfo.phone === undefined
                ? true
                : Checker.isMatch(Regex.phoneNumber(), privateContactInfo.phone);

        //Return the result
        return isEmailValid && isEmailFormatValid && isPhoneValid && isPhoneFormatValid;
    }

    /**
     * Validate the personal data values and types
     *
     * @param {IPersonalData} personalData personal data
     * @param {boolean} isUpdate is update operation
     * @returns {boolean} true / false
     */
    private static isPersonalDataValid(personalData: IPersonalData, isUpdate: boolean): boolean {
        if (personalData === undefined) {
            return true;
        }
        //Ethnicity
        //Not empty
        //Min 5-45
        const isEthnicityValid =
            isUpdate && personalData.ethnicity === undefined
                ? true
                : Checker.isStringValid(1, 45, personalData.ethnicity);

        //Ethnicity
        //Optional
        //Min 5-100
        const isMemberGroupValid =
            isUpdate && personalData.memberGroup === undefined
                ? true
                : Checker.isStringValid(1, 100, personalData.memberGroup, false);

        //Return the result
        return isEthnicityValid && isMemberGroupValid;
    }

    /**
     * Validate the MSPship objectives values and types
     *
     * @param {IMSPshipObjective} MSPshipObjectives MSPship objectives data
     * @param {boolean} isUpdate is update operation
     * @returns {boolean} true / false
     */
    private static isMSPshipObjectivesValid(MSPshipObjectives: IMSPshipObjective, isUpdate: boolean): boolean {
        if (MSPshipObjectives === undefined) {
            return true;
        }
        //LookingFor
        //Not empty
        //Min 1-45
        const isLookingForValid =
            isUpdate && MSPshipObjectives.lookingFor === undefined
                ? true
                : Checker.isStringValid(1, 45, MSPshipObjectives.lookingFor);

        //CapabilitiesProvided
        //Optional
        //Valid object
        const isCapabilitiesProvidedValid = Checker.isNullOrEmpty(
            JSON.stringify(MSPshipObjectives.capabilitiesProvided)
        )
            ? true
            : this.isTagListValid(MSPshipObjectives.capabilitiesProvided, isUpdate);

        //MSPshipGoals
        //Optional
        //Valid object
        const isMSPshipGoalsValid = Checker.isNullOrEmpty(JSON.stringify(MSPshipObjectives.MSPshipGoals))
            ? true
            : this.isTagListValid(MSPshipObjectives.MSPshipGoals);

        //IndustryExperience
        //Optional
        //Valid object
        const isIndustryExperienceValid =
            MSPshipObjectives.industryExperience === undefined
                ? true
                : this.isTagListValid(MSPshipObjectives.industryExperience, isUpdate);

        //YearsExperience
        //Not empty
        //Min 5-45
        const isYearsExperienceValid =
            isUpdate && MSPshipObjectives.yearsExperience === undefined
                ? true
                : Checker.isStringValid(1, 45, MSPshipObjectives.yearsExperience);

        //skills
        //Optional
        //Valid object
        const isSkillsValid =
            MSPshipObjectives.skills === undefined
                ? true
                : this.isTagListValid(MSPshipObjectives.skills, isUpdate);

        //IndustryInterest
        //Optional
        //Valid object
        const isIndustryInterestValid =
            MSPshipObjectives.industryInterest === undefined
                ? true
                : this.isTagListValid(MSPshipObjectives.industryInterest, isUpdate);

        //Return the result
        return (
            isLookingForValid &&
            isCapabilitiesProvidedValid &&
            isMSPshipGoalsValid &&
            isIndustryExperienceValid &&
            isYearsExperienceValid &&
            isSkillsValid &&
            isIndustryInterestValid
        );
    }

    /**
     * Validate ITagList object values
     *
     * @param {ITagList} data Tag information
     * @param {boolean} isUpdate Flag to indicate if the record is updated
     * @returns {boolean} Flag to indicate if all fields are valid
     */
    private static isTagListValid(data: ITagList, isUpdate: boolean = false): boolean {
        if (data.tags === undefined) {
            return true;
        }

        return data.tags
            .map((t: ITag) => this.isTagValueObjectValid(t, isUpdate))
            .every((isValid: boolean) => {
                return isValid == true;
            });
    }

    /**
     * Check array tags object
     *
     * @param {ITag} data tag data
     * @param {boolean} isUpdate Flag to indicate if the record is updated
     * @returns {boolean} Flag to indicate if all fields are valid
     */
    private static isTagValueObjectValid(data: ITag, isUpdate: boolean = false): boolean {
        const isCategoryValid =
            isUpdate && data.category === undefined ? true : Object.values(TagCategory).includes(data.category);
        const isStatusIdValid =
            isUpdate && data.status === undefined ? true : this.isStatusValid(data.status as RecordStatus, isUpdate);
        const isRefValid = isUpdate && data.ref === undefined ? true : Checker.isStringValid(36, 36, data.ref, false);
        const isTextValid = isUpdate && data.text === undefined ? true : Checker.isStringValid(1, 80, data.text);
        const isTypeValid = isUpdate && data.type === undefined ? true : Object.values(TagType).includes(data.type);
        return isCategoryValid && isStatusIdValid && isRefValid && isTextValid && isTypeValid;
    }
}
