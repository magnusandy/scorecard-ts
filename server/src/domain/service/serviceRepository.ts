import {Service} from "./service";
import {Optional} from "java8script";

export interface ServiceRepository {
    saveService: (service: Service) => Promise<Service>;
    findService: (serviceId: string) => Promise<Optional<Service>>;
    findServices: () => Promise<Service[]>;
    deleteService: (serviceId: string) => Promise<boolean>;
}