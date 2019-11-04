import { ServiceDTO, ServiceList, CreateService, ServiceUpdateDTO, ServerError } from "../shared/api";
import { ExceptionType } from "../shared/domain";

interface ServiceUpdateWithId extends ServiceUpdateDTO {
    id: string;
}

export async function getAllServices(): Promise<ServiceDTO[]> {
    try {
        const response = await fetch("http://localhost:8080/service", {
            method: "GET",
            mode: "cors"
        });
        const json = await response.json();
        return (json as ServiceList).services;
    } catch (error) {
        console.log("error fetching services")
        console.log(error);
        throw error;
    }
}

export async function createNewService(create: CreateService): Promise<ServiceDTO> {
    const response = await fetch("http://localhost:8080/service", {
        method: "POST",
        mode: "cors",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(create)
    });
    if (response.status === 400) {
        const json = await response.json() as ServerError;
        throw json;
    } else if (response.status !== 200) {
        const error: ServerError = {
            type: "Unknown",
            message: "Something Unknown went wrong!"
        }
        throw error;
    }
    const json = await response.json();
    return json as ServiceDTO;
}

export async function updateService(update: ServiceUpdateWithId): Promise<ServiceDTO> {
    const response = await fetch(`http://localhost:8080/service/${update.id}`, {
        method: "PUT",
        mode: "cors",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(update)
    });
    const json = await response.json();
    if (response.status === 400) {
        throw (json as ServerError);
    } else if (response.status !== 200) {
        const error: ServerError = {
            type: "Unknown",
            message: "Unknown Error",
        }
        throw error;
    }
    return json as ServiceDTO;
}

export async function deleteService(serviceId: string): Promise<boolean> {
    const response = await fetch(`http://localhost:8080/service/${serviceId}`, {
        method: "DELETE",
        mode: "cors",
    });
    if (response.status !== 200) {
        throw `Delete of service with id: ${serviceId} failed`;
    } else {
        return true;
    }
}