export enum ExceptionType {
    NotFound = "NotFound",
    Unknown = "Unknown",
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

export class UnknownException implements Exception {
    public name: string = "UnknownError";
    public type: ExceptionType = ExceptionType.Unknown;
    public message: string;

    public constructor(message: string) {
        this.message = message;
    }
}

