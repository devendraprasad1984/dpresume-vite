/**
 * Auth response
 */
export interface IAuthResponse {
    metadata: string; //IMetadata encrypted and base64 converted
}

/**
 * Metadata model
 */
export interface IMetadata {
    user: IUserIdentity;
}
/**
 * User Identity, PK and GUID/Ref
 */
export interface IUserIdentity {
    id: number;
    ref: string;
    role: string;
}
