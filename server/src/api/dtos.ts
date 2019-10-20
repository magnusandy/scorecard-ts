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