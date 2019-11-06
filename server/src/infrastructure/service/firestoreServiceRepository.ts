import { ServiceRepository } from "../../domain/service/serviceRepository";
import { Firestore, CollectionReference, DocumentReference, DocumentSnapshot, DocumentData, Query } from "@google-cloud/firestore";
import { Service } from "../../domain/service/service";
import { Optional } from "java8script";
import { UnknownException } from "../../domain/exceptions";
import { ServiceQuery } from "../../domain/service/serviceQuery";

interface SerializedService {
    id: string;
    name: string;
    team: string;
    department: string;
}
const id = "id";
const name = "name";
const team = "team";
const department = "department";

export function serializeService(service: Service): SerializedService {
    return {
        [id]: service.id,
        [name]: service.name,
        [team]: service.team,
        [department]: service.department
    }
}

export function deserializeService(obj: any) {
    const serviceData = obj as SerializedService;
    return new Service(serviceData.id, serviceData.name, serviceData.team, serviceData.department);
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
        await serviceRef.set(serializeService(service))
        return service;
    }

    public deleteService(serviceId: string): Promise<boolean> {
        const serviceRef: DocumentReference = this.serviceCollection.doc(serviceId);
        return serviceRef.delete()
            .then(_result => true)
            .catch(err => {
                throw new UnknownException(`error deleteService: \n ${JSON.stringify(err)}`);
            });
    }

    public findService(id: string): Promise<Optional<Service>> {
        return this.findServices({ id: id })
            .then(services => Optional.ofNullable(services[0]))
            .catch(err => {
                throw new UnknownException(`error findService: \n ${JSON.stringify(err)}`);
            });
    }

    public findServices(query: ServiceQuery): Promise<Service[]> {
        return this.findServicesQuery(query)
            .get()
            .then((snapshot) =>
                snapshot.docs
                    .map(this.deserializeService)
                    .filter(optService => optService.isPresent())
                    .map(optService => optService.get())
            )
            .catch(err => {
                throw new UnknownException(`error findServices: \n ${JSON.stringify(err)}`);
            });
    }

    private findServicesQuery(query: ServiceQuery): Query {
        var collectionRef: Query = this.serviceCollection;
        if (query.id) {
            collectionRef = collectionRef.where(id, "==", query.id);
        }
        if (query.name) {
            collectionRef = collectionRef.where(name, "==", query.name);
        }
        return collectionRef;
    }

    private deserializeService(doc: DocumentSnapshot): Optional<Service> {
        if (doc.exists) {
            const data: DocumentData = doc.data();
            const service = deserializeService(data);
            return Optional.of(service);
        } else {
            return Optional.empty();
        }
    }
}