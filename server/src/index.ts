import express from "express";
import { RootService } from "./infrastructure/rootService";
import { Api } from "./api/api";
import { ServiceService } from "./domain/service/serviceService";
import { ServiceRepository } from "./domain/service/serviceRepository";
import { Optional } from "java8script";
import { Service } from "./domain/service/service";
import bodyParser from "body-parser";
import { FirestoreProvider } from "./infrastructure/fireStoreProvider";
import { FirestoreServiceRepository } from "./infrastructure/firestoreServiceRepository";
import { QuestionRepository } from "./domain/questions/questionRepository";
import { Question } from "./domain/questions/question";
import { QuestionService } from "./domain/questions/questionService";


const expressApp = express();
expressApp.use(bodyParser.urlencoded({ extended: false }));
expressApp.use(bodyParser.json());

const questionRepository: QuestionRepository = {
    saveQuestion: (question: Question) => Promise.resolve(question),
    findQuestionById: (questionId: string) => Promise.resolve(Optional.empty()),
    findQuestions: () => Promise.resolve([])
}
const firestoreDatabase = new FirestoreProvider().getFirestore();
const firestoreServiceRepository = new FirestoreServiceRepository(firestoreDatabase);

const questionService = new QuestionService(questionRepository);
const serviceService = new ServiceService(firestoreServiceRepository);
const api = new Api(serviceService, questionService);
const rootService = new RootService(expressApp, api);
rootService.configure();
