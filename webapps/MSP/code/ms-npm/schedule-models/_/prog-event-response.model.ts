import { IAudit } from "../../base-models";
import { ProgEventResponse } from "./prog-event-enum";

/**
 * IProgEventResponse declarations
 */
export interface IProgEventResponse {
    id: number;
    ref: string;
    progEventTriggerId: number;
    response: ProgEventResponse;
    message: string;
    specs: string;
    audit: IAudit;
}
