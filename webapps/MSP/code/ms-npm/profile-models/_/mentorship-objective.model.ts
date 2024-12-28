import {ITagList} from "../../base-models";
import {LookingFor, YearOfExperience} from "./profile.enum";

/**
 * MSPship Objectives declarations
 */
export interface IMSPshipObjective {
    lookingFor: LookingFor;
    capabilitiesProvided: ITagList;
    MSPshipGoals: ITagList;
    industryExperience: ITagList;
    yearsExperience: YearOfExperience;
    skills: ITagList;
    industryInterest: ITagList;
}
