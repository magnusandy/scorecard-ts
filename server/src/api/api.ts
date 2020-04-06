import { CreateService, ServiceList, ServiceDTO, CreateQuestion, ReviseQuestion, ServiceUpdateDTO, QuestionList, QuestionDTO, QuestionSummary, TeamDTO, TeamsDTO } from "../shared/api";
import { ServiceService } from "../domain/service/serviceService";
import { Service } from "../domain/service/service";
import uuid = require("uuid");
import { NotFoundException } from "../domain/exceptions";
import { Optional } from "java8script";
import { QuestionService } from "../domain/questions/questionService";
import { Question, Revision } from "../domain/questions/question";
import { text } from "body-parser";

export class Api {

    private serviceService: ServiceService;
    private questionService: QuestionService;

    public constructor(serviceService: ServiceService,
        questionService: QuestionService) {
        this.serviceService = serviceService;
        this.questionService = questionService;
    }

    public async saveNewService(createService: CreateService): Promise<ServiceDTO> {
        return await this.serviceService.createService(new Service(
            uuid.v4(),
            createService.name,
            createService.team,
            createService.department
        )).then(r => (this.serviceToDto(r)));
    }

    public async findServiceById(serviceId: string): Promise<ServiceDTO> {
        const serviceOptional: Optional<Service> = await this.serviceService.findServiceById(serviceId);
        const service: Service = serviceOptional.orElseThrow(() => new NotFoundException(`service with id: ${serviceId} not found`));
        return this.serviceToDto(service);
    }

    public async findAllServices(): Promise<ServiceList> {
        const services = await this.serviceService.findServices({});
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

    public async findQuestions(): Promise<QuestionList> {
        const questions = await this.questionService.findQuestions();
        return {
            questions: questions.map(q => this.toQuestionSummary(q))
        };
    }

    public async findQuestionById(questionId: string): Promise<QuestionDTO> {
        return (await this.questionService.findQuesionById(questionId))
        .map(q => this.questionToDto(q))
        .orElseThrow(() => new NotFoundException(`question with id: ${questionId} not found.`));
    }

    public async createQuestion(createQuestion: CreateQuestion, now: Date): Promise<QuestionDTO> {
        const question: Question = new Question(
            uuid.v4(),
            [
                new Revision(1, now, createQuestion.text, createQuestion.scores, Optional.ofNullable(createQuestion.desc))
            ]
        );
        return this.questionService.saveQuestion(question)
            .then(q => this.questionToDto(q));
    }

    public reviseQuestion(questionId: string, reviseQuestion: ReviseQuestion, now: Date): Promise<QuestionDTO> {
        return this.questionService.updateQuestion({
            questionId: questionId,
            newRevisionNumber: reviseQuestion.revisionNumber,
            desc: Optional.ofNullable(reviseQuestion.desc),
            text: reviseQuestion.text,
            scores: reviseQuestion.scores
        }, now)
            .then(this.questionToDto);
    }



    public getTeams(): Promise<TeamsDTO> {
        return this.serviceService.findServices({})
            .then(services =>  {
                let uniqueSet: Set<string> = new Set(services.map(s => s.team));
                let array: TeamDTO[] = [];
                uniqueSet.forEach(t => array.push({name: t}))
                return {list: array};
            });
    }

    private serviceToDto(service: Service): ServiceDTO {
        return {
            id: service.id,
            name: service.name,
            team: service.team,
            department: service.department
        };
    }

    private toQuestionSummary(question: Question): QuestionSummary {
        const latest:Revision = question.latestRevision();
        return {
            id: question.questionId,
            text: latest.questionText,
            desc: latest.questionDescription.orElse(undefined),
            scores: latest.getScoreChoices()
        }
    }

    private questionToDto(question: Question): QuestionDTO {
        return {
            id: question.questionId,
            revisions: question.getRevisions().map(r => ({
                revisionNumber: r.revisionNumber,
                revisionTime: r.revisionTime.valueOf(),
                questionText: r.questionText,
                questionDescription: r.questionDescription.orElse(undefined),
                scoreOptions: r.getScoreChoices(),
            }))
        };
    }
}