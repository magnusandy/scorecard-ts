import { Application, Response, Request } from "express";
import { Api } from "../api/api";
import { Exception, UnknownException, ValidationException } from "../domain/exceptions";
import { CreateService, ServiceUpdateDTO, ServerError, CreateQuestion, ReviseQuestion } from "../shared/api";
import cors from "cors";
import e from "cors";
import { Optional } from "java8script";

type RequestFunction = (req: Request, res: Response) => void;
type RequestFunctionPromise<T> = (req: Request, res: Response) => Promise<T>;

export class RootService {

    private expressServer: Application;
    private api: Api;

    public constructor(expressServer: Application,
        api: Api) {
        this.expressServer = expressServer;
        this.api = api;
    }

    public configure() {
        this.expressServer.use(cors({ origin: true }))

        this.getAsync("/service/:serviceId", (req, res) => {
            return this.api.findServiceById(req.params.serviceId);
        });

        this.getAsync("/service", (req, res) => {
            return this.api.findAllServices();
        });

        this.postAsync("/service", (req, res) => {

            const unvalidatedBody: CreateService = req.body;
            const validatedBody: CreateService = {
                name: validateString("name", unvalidatedBody.name),
                team: validateString("team", unvalidatedBody.team),
                department: validateString("department", unvalidatedBody.department),
            }
            console.log(validatedBody);
            return this.api.saveNewService(validatedBody);
        });

        this.putAsync("/service/:serviceId", (req, res) => {
            const serviceId: string = req.params.serviceId;
            const unvalidatedBody: ServiceUpdateDTO = req.body;
            const validatedBody: ServiceUpdateDTO = {
                name: validateString("name", unvalidatedBody.name),
                team: validateString("team", unvalidatedBody.team),
                department: validateString("department", unvalidatedBody.department),
            }
            return this.api.updateService(serviceId, validatedBody);
        });

        this.deleteAsync("/service/:serviceId", (req, res) => {
            const serviceId: string = req.params.serviceId;
            return this.api.deleteService(serviceId);
        });

        this.getAsync("/question", () =>
            this.api.findQuestions()
        );

        this.getAsync("/question/:questionId", (req, res) =>
            this.api.findQuestionById(req.params.questionId)
        );

        this.postAsync("/question", (req, res) => {
            const unvalidatedBody = req.body;
            console.log(unvalidatedBody);
            const createDto: CreateQuestion = {
                text: validateString("text", unvalidatedBody.text),
                scores: validateArray("scores", unvalidatedBody.scores, 2),
                desc: unvalidatedBody.desc
            }
            return this.api.createQuestion(createDto, new Date());
        });

        this.putAsync("/question/:questionId", (req, res) => {
            const questionId = validateString("questionId", req.params.questionId);
            const unvalidatedBody = req.body;
            console.log(unvalidatedBody);
            const reviseQuestion: ReviseQuestion = {
                revisionNumber: validateNumber("revisionNumber", unvalidatedBody.revisionNumber),
                text: validateString("text", unvalidatedBody.text),
                scores: validateArray("scores", unvalidatedBody.scores),
                desc: unvalidatedBody.desc
            };
            return this.api.reviseQuestion(questionId, reviseQuestion, new Date())
        })

        this.getAsync("/teams", (req, res) => {
            return this.api.getTeams();
        })

        this.expressServer.listen(8080, () => console.log(`listening on port 8080`));
    }

    private getAsync<T>(path: string, requestFunction: RequestFunctionPromise<T>) {
        this.expressServer.get(path, promiseErrorMiddleware(requestFunction));
    }

    private postAsync<T>(path: string, requestFunction: RequestFunctionPromise<T>) {
        this.expressServer.post(path, promiseErrorMiddleware(requestFunction));
    }

    private putAsync<T>(path: string, requestFunction: RequestFunctionPromise<T>) {
        this.expressServer.put(path, promiseErrorMiddleware(requestFunction));
    }

    private deleteAsync<T>(path: string, requestFunction: RequestFunctionPromise<T>) {
        this.expressServer.delete(path, promiseErrorMiddleware(requestFunction));
    }
}

function validateString(name: string, val: string): string {
    if (val) {
        return val;
    } else {
        throw new ValidationException(name, val);
    }
}

function validateNumber(name: string, val: number): number {
    if (val !== undefined) {
        return val;
    } else {
        throw new ValidationException(name, val);
    }
}

function validateArray<X>(name: string, val: X[], minVals?: number, maxVals?: number): X[] {
    const exception = new ValidationException(name, val);
    if (!val) {
        throw exception;
    }
    if (minVals && val.length < minVals) {
        throw exception;
    }
    if (maxVals && val.length > maxVals) {
        throw exception;
    }
    return val;

}

function promiseErrorMiddleware<T>(reqFunction: RequestFunctionPromise<T>): RequestFunction {
    return async (req, res) => {
        try {
            const body: T = await reqFunction(req, res);
            res.send(JSON.stringify(body));
        } catch (error) {
            console.log(`HANDLING ERROR:`);
            console.log(error);
            const exception: Exception = error;
            if (exception.type && exception.message) {
                if (exception.type === "NotFound") {
                    res.status(404);
                } else if (exception.type === "IllegalArgument") {
                    res.status(400);
                } else if (exception.type === "Validation") {
                    res.status(400);
                } else {
                    res.status(500);
                }
                const exceptionDTO: ServerError = exceptionToDTO(exception);
                res.send(JSON.stringify(exceptionDTO));
            } else {
                res.status(500);
                const dto = exceptionToDTO(new UnknownException(JSON.stringify(error)))
                res.send(JSON.stringify(dto));
            }
        }
    }
}

function exceptionToDTO(exception: Exception): ServerError {
    const exceptionDTO: ServerError = {
        type: exception.type,
        message: exception.message,
    };
    return exceptionDTO;
}