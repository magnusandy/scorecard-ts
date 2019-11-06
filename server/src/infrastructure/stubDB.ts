import fs from "fs";
import { deserialize } from "v8";

export default class StubDB<X> {
    private persist: boolean;
    private path: string;
    private memdb: X[];
    private serializeFunction: (x:X) => string;
    private deSerializeFunction: (str:string) => X;
    
    constructor(persist: boolean, path: string, serialize, desrialize) {
        this.persist = persist;
        this.memdb = [];
        this.path = path;
        this.serializeFunction = serialize;
        this.deSerializeFunction = desrialize;
    }

    public getDB(): X[] {
        if (this.persist) {
            const raw = fs.readFileSync(this.path, "utf8");
            const services = (JSON.parse(raw) as []).map((s: any) => this.deSerializeFunction(s))
            console.log(services);
            return services;
        } else {
            return this.memdb;
        }

    }

    public writeDB(db: X[]): void {
        if (this.persist) {
            fs.writeFileSync(this.path, JSON.stringify(db.map(x => this.serializeFunction(x))));
        } else {
            this.memdb = db;
        }
    }
}