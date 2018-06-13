export declare const ErrorCodes: {
    TransferFailed: number;
    TooManyInvalidations: number;
    InvalidationsFailed: number;
    AlreadyInitialized: number;
    AlreadyCompleted: number;
};
export declare class Base extends Error {
    code: number;
    constructor(msg: string, code: number);
}
export declare class TransferFailed extends Base {
    transferError: Error;
    constructor(transferError: Error);
}
export declare class TooManyInvalidations extends Base {
    constructor();
}
export declare class InvalidationsFailed extends Base {
    invalidationsError: Error;
    constructor(invalidationsError: Error);
}
export declare class AlreadyInitialized extends Base {
    constructor();
}
export declare class AlreadyCompleted extends Base {
    constructor();
}
