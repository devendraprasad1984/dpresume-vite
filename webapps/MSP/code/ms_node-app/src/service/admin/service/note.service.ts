import {inject, injectable} from "tsyringe";

import {ApiError} from "fnpm/core";
import {Status} from "fnpm/enums";

import {Prisma, Note} from "/opt/nodejs/node14/db/client-mysql";
import {IModelSelect, ISort, IWhereFilter} from "/opt/nodejs/node14/db/models";
import {DbRepo} from "/opt/nodejs/node14/db";
import {PrismaClient as MySqlClient} from "/opt/nodejs/node14/db/client-mysql";

/**
 * Note Service declarations
 */
interface INoteService {
    /**
     * Retrieve notes
     *
     * @returns {Note} returns array of Note
     */
    single(id: number): Promise<Note>;

    /**
     * Retrieve notes by filter
     *
     * @param {number} id note id
     * @returns {Note[]} return note object
     */
    filter(
        filter?: IWhereFilter<Note>,
        orderBy?: ISort,
        skip?: number,
        take?: number,
        select?: IModelSelect
    ): Promise<Note[]>;

    /**
     * Create note implementation
     *
     * @param {INote} note note object from UI Model
     * @returns {Note} return new note information
     */
    create(note: Note): Promise<Note>;

    /**
     * Update note implementation
     *
     * @param {number} id note id
     * @param {INote} note note UI model
     */
    update(id: number, note: Note): Promise<Note>;

    /**
     * Delete note implementation
     *
     * @param {number} id note id
     * @param {boolean} isHard indicate if record will be deleted on db or not
     */
    delete(id: number): Promise<boolean>;
}

/**
 * Note service implementation
 */
@injectable()
export class NoteService implements INoteService {
    /**
     * NoteService constructor
     *
     * @param {DbRepo<MySqlClient>} dbService database service dependency
     */
    constructor(@inject("Db") private dbService: DbRepo<MySqlClient>) {
    }

    //methods
    /**
     * Retrieve notes
     *
     * @param {number} id note id
     * @returns {Promise<Note>} promise of type Note
     */
    async single(id: number): Promise<Note> {
        try {
            return this.dbService.retrieveUnique<Note>(Prisma.ModelName.Note, {Id: id});
        } catch (ex) {
            throw new ApiError(Status.Conflict, ex.message);
        }
    }

    /**
     * Retrieve notes by filter
     *
     * @param {IWhereFilter<Note>} filter filter to get data
     * @param {ISort} orderBy order by use
     * @param {number} skip skip use
     * @param {number} take take use
     * @param {IModelSelect} select Retrieved fields on query
     * @returns {Promise<Note[]>} promise of type Note[]
     */
    async filter(
        filter?: IWhereFilter<Note>,
        orderBy?: ISort,
        skip?: number,
        take?: number,
        select?: IModelSelect
    ): Promise<Note[]> {
        try {
            return this.dbService.retrieve<Note>(Prisma.ModelName.Note, filter, undefined, orderBy, skip, take, select);
        } catch (ex) {
            throw new ApiError(Status.Conflict, ex.message);
        }
    }

    /**
     * Create note implementation
     *
     * @param {INote} note note UI model
     * @returns {Promise<Note>} promise of type Note
     */
    async create(note: Note): Promise<Note> {
        try {
            return this.dbService.create<Note>(Prisma.ModelName.Note, note);
        } catch (ex) {
            throw new ApiError(Status.Conflict, ex.message);
        }
    }

    /**
     * Update note implementation
     *
     * @param {number} id note id
     * @param {INote} note note UI model
     * @returns {Promise<Note>} promise of type Note
     */
    async update(id: number, note: Partial<Note>): Promise<Note> {
        try {
            return this.dbService.update<Note>(Prisma.ModelName.Note, id, note);
        } catch (ex) {
            throw new ApiError(Status.Conflict, ex.message);
        }
    }

    /**
     * Delete note implementation
     *
     * @param {number} id note id
     * @param {boolean} isHard indicate if record will be deleted on db or not
     * @returns {Promise<boolean>} promise of type boolean
     */
    async delete(id: number, isHard?: boolean): Promise<boolean> {
        try {
            const r: Note = await this.dbService.delete<Note>(Prisma.ModelName.Note, id, isHard);
            return r && r.Id > 0;
        } catch (ex) {
            throw new ApiError(Status.Conflict, ex.message);
        }
    }
}
