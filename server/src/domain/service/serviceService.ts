import { ServiceRepository } from "./serviceRepository";
import { Service } from "./service";
import { Optional } from "java8script";

export class ServiceService {
    private serviceRepository: ServiceRepository;

    public constructor(serviceRepository: ServiceRepository) {
        this.serviceRepository = serviceRepository;
    }

    public async saveService(service: Service): Promise<Service> {
        return this.serviceRepository.saveService(service);
    }

    public async findServiceById(id: string): Promise<Optional<Service>> {
        return this.serviceRepository.findService(id);
    }
}