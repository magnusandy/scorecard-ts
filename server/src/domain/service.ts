export class Service {
    public readonly id: string;
    public readonly name: string;
    public readonly owner: string;
    public readonly vertical: string;

    public constructor(id: string, name: string, owner: string, vertical: string) {
        this.id = id;
        this.name = name;
        this.owner = owner;
        this.vertical = vertical;
    }
}