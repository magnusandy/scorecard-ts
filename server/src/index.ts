import express from "express";
import { RootService } from "./infrastructure/rootService";
import { Api } from "./api/api";
import { ServiceService } from "./domain/serviceService";
import { ServiceRepository } from "./domain/serviceRepository";
import { Optional } from "java8script";
import { Service } from "./domain/service";
import bodyParser from "body-parser";
import { FirestoreProvider } from "./infrastructure/fireStoreProvider";
import { FirestoreServiceRepository } from "./infrastructure/firestoreServiceRepository";


const expressApp = express();
expressApp.use(bodyParser.urlencoded({ extended: false }));
expressApp.use(bodyParser.json());
const serviceRepository: ServiceRepository = {
    saveService: (s) => Promise.resolve(s),
    findService: (serviceId) => { return Promise.resolve(Optional.empty()) }
}
const firestoreDatabase = new FirestoreProvider().getFirestore();
const firestoreServiceRepository = new FirestoreServiceRepository(firestoreDatabase);

const serviceService = new ServiceService(firestoreServiceRepository);
const api = new Api(serviceService);
const rootService = new RootService(expressApp, api);
rootService.configure();
