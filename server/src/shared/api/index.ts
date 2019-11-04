import { ExceptionType } from "../domain";

export interface CreateService {
    name: string;
    team: string;
    department: string;
}

export interface ServiceDTO {
    id: string;
    name: string;
    team: string;
    department: string;
}

export interface ServiceUpdateDTO {
    name: string;
    team: string;
    department: string;
}

export interface ServiceList {
    services: ServiceDTO[];
}

export interface CreateQuestion {
    text: string;
    scores: number[];
}

export interface ReviseQuestion {
    questionId: string;
    revisionNumber: number;
    text: string;
    scores: number[];
}

export interface ServerError {
    type: ExceptionType;
    message: string;
}

