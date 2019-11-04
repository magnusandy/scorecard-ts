import { Application, Response, Request } from "express";
import { Api } from "../api/api";
import { Exception, ExceptionType, UnknownException, ValidationException } from "../domain/exceptions";
import { CreateService, ServiceUpdateDTO } from "../shared/dtos";
import cors from "cors";

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
            return this.api.findServices();
        })

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
                team: validateString("team", unvalidatedBody.team),
                department: validateString("department", unvalidatedBody.department),
            }
            return this.api.updateService(serviceId, validatedBody);
        });

        this.deleteAsync("/service/:serviceId", (req, res) => {
            const serviceId: string = req.params.serviceId;
            return this.api.deleteService(serviceId);
        });

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

function errorMiddleware(reqFunction: RequestFunction): RequestFunction {
    return (req, res) => {
        try {
            reqFunction(req, res);
        } catch (error) {
            console.log(`HANDLING ERROR:`);
            console.log(error);
            const exception: Exception = error;
            if (exception.type && exception.message) {
                if (exception.type === ExceptionType.NotFound) {
                    res.status(404);
                } else {
                    res.status(500);
                }
                res.send(exception);
            } else {
                res.status(500);
                res.send(new UnknownException(JSON.stringify(error)))
            }
        }
    }
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
                if (exception.type === ExceptionType.NotFound) {
                    res.status(404);
                } else {
                    res.status(500);
                }
                res.send(exception);
            } else {
                res.status(500);
                res.send(new UnknownException(JSON.stringify(error)))
            }
        }
    }
}