import { Application, Response, Request } from "express";
import { Api } from "../api/api";
import { Exception, ExceptionType, UnknownException } from "../domain/exceptions";
import { CreateService } from "../api/dtos";
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
        this.expressServer.use(cors({origin:true}))

        this.get("/", (_req, res: Response) => {
            res.send("Hello World");
        });

        this.getAsync("/service/:serviceId", (req, res) => {
            return this.api.findServiceById(req.params.serviceId);
        });

        this.getAsync("/service", (req, res) => {
            console.log("GET services")
            return this.api.findServices();
        })

        this.postAsync("/service", (req, res) => {
            const body: CreateService = req.body;
            console.log(body);
            return this.api.saveNewService(body);
        });

        this.expressServer.listen(8080, () => console.log(`listening on port 8080`));
    }

    private get(path: string, requestFunction: RequestFunction) {
        this.expressServer.get(path, errorMiddleware(requestFunction));
    }

    private getAsync<T>(path: string, requestFunction: RequestFunctionPromise<T>) {
        this.expressServer.get(path, promiseErrorMiddleware(requestFunction));
    }

    private postAsync<T>(path: string, requestFunction: RequestFunctionPromise<T>) {
        this.expressServer.post(path, promiseErrorMiddleware(requestFunction));
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
            const body:T = await reqFunction(req, res);
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