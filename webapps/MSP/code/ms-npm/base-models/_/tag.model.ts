import { IAudit } from "./audit.model";
import { TagCategory, TagType } from "./tag.enum";

/**
 * Interface for tags UI
 */
export interface ITag {
    id: number;
    ref: string;
    status: string;
    type: TagType;
    category: TagCategory;
    text: string;
    audit: IAudit;
}

/**
 * Object that will be stored on db json
 */
export interface ITagList {
    tags: Partial<ITag>[];
}
