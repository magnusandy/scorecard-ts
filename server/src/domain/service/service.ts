export class Service {
    public readonly id: string;
    public readonly name: string;
    public readonly team: string;
    public readonly department: string;

    public constructor(id: string, name: string, team: string, department: string) {
        this.id = id;
        this.name = name;
        this.team = team;
        this.department = department;
    }
}