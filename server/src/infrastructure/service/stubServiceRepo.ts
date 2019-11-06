import { ServiceRepository } from "../../domain/service/serviceRepository";
import { Service } from "../../domain/service/service";
import { Optional } from "java8script";
import { ServiceQuery } from "../../domain/service/serviceQuery";
import StubDB from "../stubDB";
import { serializeService, deserializeService } from "./firestoreServiceRepository";

export default class StubServiceRepository implements ServiceRepository {

    private db: StubDB<Service>;
    

    constructor(persist: boolean) {
        this.db = new StubDB<Service>(persist, require("path").resolve(__dirname, "./stubDB.json"),
        (service) => JSON.stringify(serializeService(service)),
        (str) => deserializeService(JSON.parse(str))
    );
    }

    saveService = (service: Service): Promise<Service> => {
        const db = this.db.getDB();
        this.db.writeDB([service, ...db]);
        return Promise.resolve(service);
    };
    findService = (serviceId: string): Promise<Optional<Service>> => {
        const service = this.db.getDB().find(s => s.id === serviceId);
        return Promise.resolve(Optional.ofNullable(service));
    };
    findServices = (query: ServiceQuery): Promise<Service[]> => {
        const services = this.db.getDB();
        return Promise.resolve(services.filter(s => this.matchesQuery(s, query)));
    };

    private matchesQuery(item: Service, query: ServiceQuery): boolean {
        return Optional.ofNullable(query.name).map(n => n === item.name).orElse(true)
        && Optional.ofNullable(query.id).map(n => n === item.id).orElse(true);
    }

    deleteService = (serviceId: string): Promise<boolean> => {
        const newDB = this.db.getDB().filter(s => s.id !== serviceId);
        this.db.writeDB(newDB);
        return Promise.resolve(true);
    };
}