export enum ExceptionType {
    NotFound = "NotFound",
    Unknown = "Unknown",
    BadState = "BadState",
    Validation= "Validation"
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

export class ValidationException implements Exception {
    public name: string = "ValidationException";
    public type: ExceptionType = ExceptionType.Unknown;
    public message: string;

    public constructor(fieldName: string, value?: any) {
        this.message = `Field named ${fieldName} not valid, value was "${value}"` ;
    }
}

