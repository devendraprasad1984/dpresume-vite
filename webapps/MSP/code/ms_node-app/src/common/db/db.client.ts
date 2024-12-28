import { PrismaClient as MySqlClient } from "./client-mysql";
//import { PrismaClient as MongoDbClient } from "./client-mongodb";
import { ClientType } from "./enums";

/**
 * Db Client interface declarations
 */
export interface IDbClient<T> {
    // property
    client: T;
    message: string;

    // method;
    /**
     * Initialize client connection/pool
     */
    init(): void;
}
/**
 * DB Client class
 */
export class DbClient<T> implements IDbClient<T> {
    // properties
    private _clientType: ClientType;
    //private _mongoDbClient: MongoDbClient;
    private _mySqlDbClient: MySqlClient;
    private _client: T;
    private _message: string = "";

    /**
     * DbClient constructor
     *
     * @param {ClientType} clientType client type enum
     */
    constructor(clientType: ClientType) {
        this._clientType = clientType;
    }

    // getter /setter
    /**
     * getter for client
     *
     * @returns {T} client property
     */
    public get client(): T {
        return this._client;
    }

    /**
     * getter for message
     *
     * @returns {string} client property
     */
    public get message(): string {
        return this._message;
    }

    // public methods

    /**
     * Initialize connection     *
     *
     */
    public init() {
        try {
            const dbConnection = {
                [ClientType.MySql]: async () => {
                    this._mySqlDbClient = new MySqlClient();
                    this._client = this._mySqlDbClient as unknown as T;
                }
                // [ClientType.MongoDb]: async () => {
                //     this._mongoDbClient = new MongoDbClient();
                //     this._client = this._mongoDbClient as unknown as T;
                // }
            };
            dbConnection[this._clientType]();
        } catch (exception) {
            this._client = <T>{};
            this._message = exception;
        }
    }
}
