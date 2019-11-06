import express from "express";
import { RootService } from "./infrastructure/rootService";
import { Api } from "./api/api";
import { ServiceService } from "./domain/service/serviceService";
import bodyParser from "body-parser";
import { FirestoreProvider } from "./infrastructure/fireStoreProvider";
import { FirestoreServiceRepository } from "./infrastructure/service/firestoreServiceRepository";
import { FirestoreQuestionRepository } from "./infrastructure/question/firestoreQuestionRepository";
import { QuestionRepository } from "./domain/questions/questionRepository";
import { QuestionService } from "./domain/questions/questionService";
import StubServiceRepository from "./infrastructure/service/stubServiceRepo";
import activeConfig from "./shared/config/config";
import StubQuestionRepository from "./infrastructure/question/stubQuestionRepository";


const expressApp = express();
expressApp.use(bodyParser.urlencoded({ extended: false }));
expressApp.use(bodyParser.json());

const firestoreServiceRepository = activeConfig.useStubRepo
    ? new StubServiceRepository(false)
    : new FirestoreServiceRepository(new FirestoreProvider().getFirestore());
const questionRepository: QuestionRepository = activeConfig.useStubRepo
    ? new StubQuestionRepository(false)
    : new FirestoreQuestionRepository(new FirestoreProvider().getFirestore());

const questionService = new QuestionService(questionRepository);
const serviceService = new ServiceService(firestoreServiceRepository);
const api = new Api(serviceService, questionService);
const rootService = new RootService(expressApp, api);
rootService.configure();
