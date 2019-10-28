export interface Service {
    id: string;
    name: string;
    owner: string;
    vertical: string;
}

interface ServiceList {
    services: Service[];
}


export async function getAllServices(): Promise<Service[]> {
    try {
        const response = await fetch("http://localhost:4000/service", {
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