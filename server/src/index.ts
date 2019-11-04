import express from "express";
import { RootService } from "./infrastructure/rootService";
import { Api } from "./api/api";
import { ServiceService } from "./domain/service/serviceService";
import bodyParser from "body-parser";
import { FirestoreProvider } from "./infrastructure/fireStoreProvider";
import { FirestoreServiceRepository } from "./infrastructure/firestoreServiceRepository";
import { FirestoreQuestionRepository } from "./infrastructure/firestoreQuestionRepository";
import { QuestionRepository } from "./domain/questions/questionRepository";
import { QuestionService } from "./domain/questions/questionService";


const expressApp = express();
expressApp.use(bodyParser.urlencoded({ extended: false }));
expressApp.use(bodyParser.json());

const firestoreDatabase = new FirestoreProvider().getFirestore();
const firestoreServiceRepository = new FirestoreServiceRepository(firestoreDatabase);
const questionRepository: QuestionRepository = new FirestoreQuestionRepository(firestoreDatabase);

const questionService = new QuestionService(questionRepository);
const serviceService = new ServiceService(firestoreServiceRepository);
const api = new Api(serviceService, questionService);
const rootService = new RootService(expressApp, api);
rootService.configure();
