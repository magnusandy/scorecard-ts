import { ServiceRepository } from "./serviceRepository";
import { Service } from "./service";
import { Optional } from "java8script";
import ServiceUpdate from "./serviceUpdate";
import { NotFoundException, IllegalArgumentException } from "../exceptions";
import { ServiceQuery } from "./serviceQuery";

export class ServiceService {
    private serviceRepository: ServiceRepository;

    public constructor(serviceRepository: ServiceRepository) {
        this.serviceRepository = serviceRepository;
    }

    public async saveService(service: Service): Promise<Service> {
        const withName: Service[] = await this.serviceRepository.findServices({ name: service.name });
        if (withName.length > 0) {
            throw new IllegalArgumentException(`Cannot create a new service, one with the name ${service.name} already exists.`)
        } else {
            return this.serviceRepository.saveService(service);
        }
    }

    public async updateService(serviceUpdate: ServiceUpdate): Promise<Service> {
        const existingService: Service = (await this.findServiceById(serviceUpdate.id))
            .orElseThrow(() => new NotFoundException(`service with id: ${serviceUpdate.id} not found during update;`));
        const updatedService = new Service(serviceUpdate.id, existingService.name, serviceUpdate.team, serviceUpdate.department);
        return this.saveService(updatedService);
    }

    public deleteService(serviceId: string): Promise<boolean> {
        return this.serviceRepository.deleteService(serviceId);
    }

    public async findServiceById(id: string): Promise<Optional<Service>> {
        return this.serviceRepository.findService(id);
    }

    public findServices(query: ServiceQuery): Promise<Service[]> {
        return this.serviceRepository.findServices(query);
    }
}