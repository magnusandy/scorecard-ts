export interface Service {
    id: string;
    name: string;
    owner: string;
    vertical: string;
}

export interface CreateService {
    name: string;
    owner: string;
    vertical: string;
}

interface ServiceList {
    services: Service[];
}


export async function getAllServices(): Promise<Service[]> {
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

export async function createNewService(create: CreateService): Promise<Service> {
    console.log(create);
    const response = await fetch("http://localhost:8080/service", {
        method: "POST",
        mode: "cors",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(create)
    });
    const json = await response.json();
    if(response.status !== 200) {
        throw "Something went wrong";
    }
    console.log(json);
    return json as Service;
}