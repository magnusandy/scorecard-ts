import { CreateService, ServiceList, ServiceDTO } from "./dtos";
import { ServiceService } from "../domain/serviceService";
import { Service } from "../domain/service";
import uuid = require("uuid");
import { NotFoundException } from "../domain/exceptions";
import { Optional } from "java8script";

export class Api {

    private serviceService: ServiceService;

    public constructor(serviceService: ServiceService) {
        this.serviceService = serviceService;
    }

    public async saveNewService(createService: CreateService): Promise<ServiceDTO> {
        return await this.serviceService.saveService(new Service(
            uuid.v4(),
            createService.name,
            createService.owner,
            createService.vertical
        )).then(r => ({
            id: r.id,
            name: r.name,
            owner: r.owner,
            vertical: r.vertical
        }));
    }

    public async findServiceById(serviceId: string): Promise<ServiceDTO> {
        const serviceOptional: Optional<Service> = await this.serviceService.findServiceById(serviceId);
        const service: Service = serviceOptional.orElseThrow(() => new NotFoundException(`service with id: ${serviceId} not found`));
        return {
            id: service.id,
            name: service.name,
            owner: service.owner,
            vertical: service.vertical
        };
    }
}