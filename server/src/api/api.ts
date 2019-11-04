import { CreateService, ServiceList, ServiceDTO, CreateQuestion, ReviseQuestion, ServiceUpdateDTO } from "../shared/dtos";
import { ServiceService } from "../domain/service/serviceService";
import { Service } from "../domain/service/service";
import uuid = require("uuid");
import { NotFoundException } from "../domain/exceptions";
import { Optional } from "java8script";
import { QuestionService } from "../domain/questions/questionService";
import { Question, Revision } from "../domain/questions/question";

export class Api {

    private serviceService: ServiceService;
    private questionService: QuestionService;

    public constructor(serviceService: ServiceService,
        questionService: QuestionService) {
        this.serviceService = serviceService;
    }

    public async saveNewService(createService: CreateService): Promise<ServiceDTO> {
        return await this.serviceService.saveService(new Service(
            uuid.v4(),
            createService.name,
            createService.owner,
            createService.vertical
        )).then(r => (this.serviceToDto(r)));
    }

    public async findServiceById(serviceId: string): Promise<ServiceDTO> {
        const serviceOptional: Optional<Service> = await this.serviceService.findServiceById(serviceId);
        const service: Service = serviceOptional.orElseThrow(() => new NotFoundException(`service with id: ${serviceId} not found`));
        return this.serviceToDto(service);
    }

    public async findServices(): Promise<ServiceList> {
        const services = await this.serviceService.findServices();
        return {
            services: services.map(s => this.serviceToDto(s))
        }
    }

    public async updateService(serviceId: string, updateDto: ServiceUpdateDTO): Promise<ServiceDTO> {
        const service = await this.serviceService.updateService({ id: serviceId, ...updateDto });
        return this.serviceToDto(service);
    }

    public deleteService(serviceId: string): Promise<boolean> {
        return this.serviceService.deleteService(serviceId);
    }

    public async createQuestion(createQuestion: CreateQuestion, now: Date) {
        const question: Question = new Question(
            uuid.v4(),
            [
                new Revision(1, now, createQuestion.text, createQuestion.scores)
            ]
        );
        return this.questionService.saveQuestion(question);
    }

    public async reviseQuestion(reviseQuestion: ReviseQuestion, now: Date) {
        this.questionService.updateQuestion({
            newRevisionNumber: reviseQuestion.revisionNumber,
            ...reviseQuestion
        }, now);
    }

    private serviceToDto(service: Service): ServiceDTO {
        return {
            id: service.id,
            name: service.name,
            owner: service.owner,
            vertical: service.vertical
        };
    }
}