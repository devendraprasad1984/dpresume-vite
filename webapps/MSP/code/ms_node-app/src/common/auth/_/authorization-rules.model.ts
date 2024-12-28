import { Role } from "ms-npm/auth-models";

/**
 * Authorization rules section list
 */
export enum Section {
    User = "User",
    Profile = "Profile",
    Company = "Company",
    Personnel = "Personnel",
    Job = "Job",
    Interview = "Interview",
    Session = "Session",
    Topic = "Topic",
    Conversation = "Conversation",
    Message = "Message",
    Flag = "Flag",
    Note = "Note",
    Match = "Match"
}
/**
 * Authorization rules model
 */
export interface IAuthorizationRules {
    Rules: Map<Section, Map<Role, string>>;
}
