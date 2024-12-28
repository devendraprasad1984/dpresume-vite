import {delay, inject, injectable} from "tsyringe";

import {ApiResponse, ApiError, IApiResponse} from "fnpm/core";
import {Message, Status} from "fnpm/enums";
import {Hasher, UtcDate} from "fnpm/utils";

import {INote} from "ms-npm/admin-models";
import {ModelMapper} from "ms-npm/model-mapper";

import {RecordStatus} from "/opt/nodejs/node14/db/enums";
import {Note} from "/opt/nodejs/node14/db/client-mysql";

import {NoteService} from "../service/note.service";
import {Validator} from "../validator";

/**
 * Note Controller declarations
 */
interface INoteController {
    /**
     * Retrieve notes
     *
     * @returns {Note[]} returns array of Note
     */
    getNotes(id: number): Promise<IApiResponse<INote[]>>;

    /**
     * Retrieve notes by filter
     *
     * @param {number} id note id
     * @returns {Note} return note object
     */
    getNotesById(id?: number): Promise<IApiResponse<INote>>;

    /**
     * Retrieve notes by user id
     *
     * @param {number} userId user id
     * @returns {Note[]} returns array of Note
     */
    getNotesByUserId(userId: number): Promise<IApiResponse<INote[]>>;

    /**
     * Create note implementation
     *
     * @param {INote} note note object from UI Model
     * @returns {INote} return new note ui information
     */
    createNote(note: INote): Promise<IApiResponse<INote>>;

    /**
     * Update note implementation
     *
     * @param {number} id note id
     * @param {INote} note UI note model
     * @returns {INote} return new note ui information
     */
    updateNote(id: number, note: INote): Promise<IApiResponse<INote>>;

    /**
     * Delete note implementation
     *
     * @param {number} id note id
     * @param {boolean} isHard indicate if record will be deleted on db or not
     * @returns {boolean} record deleted or not
     */
    deleteNote(id: number, isHard?: boolean): Promise<IApiResponse<boolean>>;
}

/**
 * Note Controller implementation
 */
@injectable()
export class NoteController extends ModelMapper implements INoteController {
    /**
     * Note Controller constructor
     *
     * @param {NoteService} service notes service dependency
     */
    constructor(@inject(delay(() => NoteService)) private service: NoteService) {
        super();
    }

    //methods
    /**
     * Retrieve notes
     *
     * @returns {Note} returns array of Note
     */
    async getNotes(): Promise<IApiResponse<INote[]>> {
        // filter all the active
        const filter: Partial<Note> = {Status: RecordStatus.Active};

        const r: Note[] = await this.service.filter(filter);

        const notesUI: INote[] = [];
        r.forEach((note: Note) => {
            const noteUI: INote = super.fromDbModel<INote>(note);
            notesUI.push(noteUI);
        });
        return new ApiResponse(Status.OK, notesUI);
    }

    /**
     * Retrieve notes by filter
     *
     * @param {number} id note id
     * @returns {INote} return note object
     */
    async getNotesById(id: number): Promise<IApiResponse<INote>> {
        if (id > 0) {
            const r: Note = await this.service.single(id);
            const noteUI: INote = super.fromDbModel<INote>(r);
            return new ApiResponse(Status.OK, noteUI);
        } else {
            throw new ApiError(Status.BadRequest, Message.InvalidData);
        }
    }

    /**
     * Retrieve notes by user id
     *
     * @param {number} userId user id
     * @returns {Note[]} returns array of Note
     */
    async getNotesByUserId(userId: number): Promise<IApiResponse<INote[]>> {
        if (userId > 0) {
            const noteDB: Partial<Note> = {UserId: userId};
            const r: Note[] = await this.service.filter(noteDB);

            const notesUI: INote[] = [];
            r.forEach((note: Note) => {
                const noteUI: INote = super.fromDbModel<INote>(note);
                notesUI.push(noteUI);
            });
            return new ApiResponse(Status.OK, notesUI);
        } else {
            throw new ApiError(Status.BadRequest, Message.InvalidData);
        }
    }

    /**
     * Create note implementation
     *
     * @param {INote} note note UI model
     * @returns {INote} note UI model
     */
    async createNote(note: INote): Promise<IApiResponse<INote>> {
        if (Validator.isNoteDataValid(note)) {
            const noteDB: Note = super.toDbModel<Note>(note);
            noteDB.CreatedOn = UtcDate.now();
            noteDB.CreatedBy = Hasher.guid();
            const r: Note = await this.service.create(noteDB);
            const noteUI: INote = super.fromDbModel<INote>(r);
            return new ApiResponse(Status.OK, noteUI);
        } else {
            throw new ApiError(Status.BadRequest, Message.InvalidData);
        }
    }

    /**
     * Update note implementation
     *
     * @param {number} id note id
     * @param {INote} note note UI model
     * @returns {INote} note UI model
     */
    async updateNote(id: number, note: INote): Promise<IApiResponse<INote>> {
        if (id > 0 && Validator.isNoteDataValid(note, true)) {
            const noteDB: Note = super.toDbModel<Note>(note);
            const r: Note = await this.service.update(id, noteDB);

            const noteUI: INote = super.fromDbModel<INote>(r);
            return new ApiResponse(Status.OK, noteUI);
        } else {
            throw new ApiError(Status.BadRequest, Message.InvalidData);
        }
    }

    /**
     * Delete note implementation
     *
     * @param {number} id note id
     * @param {boolean} isHard indicate if record will be deleted on db or not
     * @returns {boolean} record deleted or not
     */
    async deleteNote(id: number, isHard?: boolean): Promise<IApiResponse<boolean>> {
        if (id > 0) {
            const r: boolean = await this.service.delete(id, isHard);
            return new ApiResponse(Status.OK, r);
        } else {
            throw new ApiError(Status.BadRequest, Message.InvalidData);
        }
    }
}
