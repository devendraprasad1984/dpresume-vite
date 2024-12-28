import { IAudit } from "../../base-models";
import { ProgEventCategory, ProgEventType } from "./prog-event-enum";

/**
 * IProgEventTrigger declarations
 */
export interface IProgEventTrigger {
    id: number;
    Ref: string;
    status: number;
    type: ProgEventType;
    category: ProgEventCategory;
    audit: IAudit;
}
