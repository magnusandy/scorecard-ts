import { Service } from "./service";
import { Optional } from "java8script";
import { ServiceQuery } from "./serviceQuery";

export interface ServiceRepository {
    saveService: (service: Service) => Promise<Service>;
    findService: (serviceId: string) => Promise<Optional<Service>>;
    findServices: (query: ServiceQuery) => Promise<Service[]>;
    deleteService: (serviceId: string) => Promise<boolean>;
}