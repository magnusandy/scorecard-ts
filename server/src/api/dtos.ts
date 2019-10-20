export interface CreateService {
    name: string;
    owner: string;
    vertical: string;
}

export interface ServiceDTO {
    id: string;
    name: string;
    owner: string;
    vertical: string;
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

