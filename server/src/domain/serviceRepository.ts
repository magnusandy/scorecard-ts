import {Service} from "./service";
import {Optional} from "java8script";

export interface ServiceRepository {
    saveService: (service: Service) => Promise<Service>;
    findService: (id: string) => Promise<Optional<Service>>;
}