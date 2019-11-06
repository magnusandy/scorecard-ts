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
    desc?: string;
    scores: number[];
}

export interface QuestionDTO {
    id: string;
    revisions: RevisionDTO[];
}

export interface QuestionSummary {
    id: string;
    text: string;
    desc?: string;
    scores: number[];
}

export interface RevisionDTO {
    revisionNumber: number;
    revisionTime: number; //timestamp
    questionText: string;
    questionDescription?: string;
    scoreOptions: number[];
}

export interface QuestionList {
    questions: QuestionSummary[];
}

export interface ReviseQuestion {
    revisionNumber: number;
    text: string;
    desc?: string;
    scores: number[];
}

export interface ServerError {
    type: ExceptionType;
    message: string;
}

