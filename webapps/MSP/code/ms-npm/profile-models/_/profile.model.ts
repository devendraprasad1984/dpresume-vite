import {IUser} from "../../user-models";
import {IAudit} from "../../base-models";
import {IBasicInfo} from "./basic-info.model";
import {IBio} from "./bio.model";
import {IEducationHistory} from "./education-history.model";
import {IMSPshipObjective} from "./MSPship-objective.model";
import {INotification} from "./notification.model";
import {IPersonalData} from "./personal-data.model";
import {IPrivateContactInfo} from "./private-contact-info.model";
import {IPublicContactInfo} from "./public-contact-info.model";
import {IWorkHistory} from "./work-history.model";

/**
 * Profile declarations
 */
export interface IProfile {
    id: number;
    ref: string;
    userId: number;
    claimCode: string;
    basicInfo: IBasicInfo;
    bio: IBio;
    user: IUser;
    workHistory: IWorkHistory[];
    educationHistory: IEducationHistory[];
    publicContactInfo: IPublicContactInfo;
    privateContactInfo: IPrivateContactInfo;
    personalData: IPersonalData;
    status: string;
    MSPshipObjectives: IMSPshipObjective;
    notifications: INotification;
    audit: IAudit;
}
