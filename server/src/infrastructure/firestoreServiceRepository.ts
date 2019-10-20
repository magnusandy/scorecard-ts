import { ServiceRepository } from "../domain/service/serviceRepository";
import { Firestore, CollectionReference, DocumentReference, DocumentSnapshot, DocumentData } from "@google-cloud/firestore";
import { Service } from "../domain/service/service";
import { Optional } from "java8script";
import { UnknownException } from "../domain/exceptions";

interface SerializedService {
    id: string;
    name: string;
    owner: string;
    vertical: string;
}

export class FirestoreServiceRepository implements ServiceRepository {
    private firestore: Firestore;
    private serviceCollection: CollectionReference;

    public constructor(firestore: Firestore) {
        this.firestore = firestore;
        this.serviceCollection = this.firestore.collection("Services");
    }

    public async saveService(service: Service): Promise<Service> {
        const serviceRef: DocumentReference = this.serviceCollection.doc(service.id);
        await serviceRef.set(this.serializeService(service))
        return service;
    }

    public findService(id: string): Promise<Optional<Service>> {
        const serviceRef: DocumentReference = this.serviceCollection.doc(id);
        return serviceRef.get()
            .then(doc => this.deserializeService(doc))
            .catch(err => {
                throw new UnknownException(JSON.stringify(err));
            })
    }

    private serializeService(service: Service): SerializedService {
        return {
            ...service
        }
    }
    private deserializeService(doc: DocumentSnapshot): Optional<Service> {
        if (doc.exists) {
            const data: DocumentData = doc.data();
            const serviceData: SerializedService = data as SerializedService;
            const service = new Service(serviceData.id, serviceData.name, serviceData.owner, serviceData.vertical);
            return Optional.of(service);
        } else {
            return Optional.empty();
        }
    }
}