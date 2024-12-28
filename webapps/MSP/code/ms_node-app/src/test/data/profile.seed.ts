import {UtcDate} from "fnpm/utils";

import {RecordStatus} from "../../common/db/enums";

import {TagCategory, TagType} from "ms-npm/base-models";
import {IProfile, LookingFor, YearOfExperience} from "ms-npm/profile-models";

export const newProfile: IProfile = {
    id: 0,
    claimCode: "xxx",
    ref: "",
    user: undefined,
    educationHistory: undefined,
    workHistory: undefined,
    userId: 11,
    status: RecordStatus.Active,

    basicInfo: {
        firstName: "Keelie",
        lastName: "Banks",
        pronouns: "she/her",
        headline: "Engineering Manager",
        companyHeadline: "Fresh Consulting",
        picture:
            "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.pngitem.com%2Fmiddle%2FwxwTmm_female-user-image-icon-hd-png-download%2F&psig=AOvVaw1ekhB2szCSClOew6GI6-nS&ust=1646320781372000&source=images&cd=vfe&ved=0CAsQjRxqFwoTCLCejP_cp_YCFQAAAAAdAAAAABAD",
        city: "Seattle",
        state: "WA"
    },
    bio: {
        intro: "This is a little prompt example",
        text: "All the text here"
    },
    publicContactInfo: {
        website: "http://website.com",
        linkedin: "http://linkedin.com",
        facebook: "http://facebook.com",
        instagram: "http://instagram.com",
        twitter: "http://twitter.com"
    },
    privateContactInfo: {
        email: "test@test.com",
        phone: "206-509-6995"
    },
    personalData: {
        memberGroup: "Placerat duis ultricies lacus sed",
        ethnicity: "Asian"
    },
    MSPshipObjectives: {
        lookingFor: LookingFor.MSPMentee,
        capabilitiesProvided: {
            tags: [
                {
                    id: 0,
                    status: RecordStatus.Active,
                    category: TagCategory.ICanProvide,
                    type: TagType.User,
                    text: "Career Guidance"
                },
                {
                    id: 0,
                    status: RecordStatus.Active,
                    category: TagCategory.ICanProvide,
                    type: TagType.User,
                    text: "Portfolio Guidance"
                }
            ]
        },
        MSPshipGoals: {
            tags: [
                {
                    id: 0,
                    status: RecordStatus.Active,
                    category: TagCategory.MSPshipGoals,
                    type: TagType.User,
                    text: "Practice Interviews"
                },
                {
                    id: 0,
                    status: RecordStatus.Active,
                    category: TagCategory.MSPshipGoals,
                    type: TagType.User,
                    text: "Practice Presentations"
                }
            ]
        },
        industryExperience: {
            tags: [
                {
                    id: 0,
                    status: RecordStatus.Active,
                    category: TagCategory.IndustryExperience,
                    type: TagType.User,
                    text: "Education"
                }
            ]
        },
        yearsExperience: YearOfExperience.fiveTen,
        skills: {
            tags: [
                {
                    id: 0,
                    status: RecordStatus.Active,
                    category: TagCategory.Skills,
                    type: TagType.User,
                    text: "Software Engineering"
                },
                {
                    id: 0,
                    status: RecordStatus.Active,
                    category: TagCategory.Skills,
                    type: TagType.User,
                    text: "Team Manager"
                }
            ]
        },
        industryInterest: {
            tags: [
                {
                    id: 0,
                    status: RecordStatus.Active,
                    category: TagCategory.Interest,
                    type: TagType.User,
                    text: "Education"
                }
            ]
        }
    },
    notifications: {
        isAppMessagingAllowed: false,
        isPushNotificationAllowed: false
    },
    audit: {
        createdBy: "4223d935-da73-3935-bbb7-2fbb3989cc26",
        createdOn: UtcDate.now(),
        modifiedBy: undefined,
        modifiedOn: undefined
    }
};

export const updateProfile = {
    status: RecordStatus.Active,
    basicInfo: {
        firstName: "Keelier",
        lastName: "Banks Williams",
        companyHeadline: "Fresh Consulting"
    }
};

export const updateProfileStatus = {status: RecordStatus.Archived};

export const updateProfileTags = {
    MSPshipObjectives: {
        skills: {
            tags: [
                {
                    id: 0,
                    status: RecordStatus.Active,
                    category: TagCategory.Skills,
                    type: TagType.User,
                    text: "Software Architect"
                }
            ]
        }
    }
};
