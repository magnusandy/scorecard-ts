export enum ExceptionType {
    NotFound = "NotFound",
    Unknown = "Unknown",
    BadState = "BadState",
}

export interface Exception extends Error {
    type: ExceptionType;
    message: string;
}

export class NotFoundException implements Exception {
    public name: string = "NotFoundException";
    public type: ExceptionType = ExceptionType.NotFound;
    public message: string;

    public constructor(message: string) {
        this.message = message;
    }
}

export class BadStateException implements Exception {
    public name: string = "BadStateException";
    public type: ExceptionType = ExceptionType.BadState;
    public message: string;

    public constructor(message: string) {
        this.message = message;
    }
}

export class UnknownException implements Exception {
    public name: string = "UnknownException";
    public type: ExceptionType = ExceptionType.Unknown;
    public message: string;

    public constructor(message: string) {
        this.message = message;
    }
}

