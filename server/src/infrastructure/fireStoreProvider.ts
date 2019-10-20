import { Firestore } from "@google-cloud/firestore";
import secretFile from "../secrets/googleCreds.json";

export class FirestoreProvider {
    private database: Firestore;
    constructor() {
        this.database = new Firestore({
            projectId: secretFile.project_id,
            keyFilename: "./src/secrets/googleCreds.json"
        });
    }
    public getFirestore(): Firestore {
        return this.database;
    }
}