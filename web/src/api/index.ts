import { ServiceDTO, ServiceList, CreateService, ServiceUpdateDTO, ServerError, QuestionList, QuestionDTO, QuestionSummary, RevisionDTO, ReviseQuestion } from "../shared/api";
import { ExceptionType } from "../shared/domain";
import { Question } from "../questions/question";

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

export async function getAllQuestions(): Promise<QuestionSummary[]> {
    try {
        const response = await fetch("http://localhost:8080/question", {
            method: "GET",
            mode: "cors"
        });
        const json = await response.json();
        return (json as QuestionList).questions
    } catch (error) {
        console.log("error fetching question")
        console.log(error);
        throw error;
    }
}

export async function getRevisionsForQuestion(questionId: string): Promise<RevisionDTO[]> {
    try {
        const response = await fetch(`http://localhost:8080/question/${questionId}`, {
            method: "GET",
            mode: "cors"
        });
        const json = await response.json();
        console.log(json);
        return (json as QuestionDTO).revisions;
    } catch (error) {
        console.log("error fetching questions")
        console.log(error);
        throw error;
    }
}

export async function addNewRevision(questionId: string, revision:ReviseQuestion):Promise<QuestionDTO> {
    const response = await fetch(`http://localhost:8080/question/${questionId}`, {
        method: "PUT",
        mode: "cors",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(revision)
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
    return json as QuestionDTO;
}

export async function getTeamList(): Promise<string[]> {
    return ["team1", "team2"];
}