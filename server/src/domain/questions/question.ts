export class Question {
    public readonly questionId: string;
    private revisions: Revision[];

    public constructor(questionId: string, revisions: Revision[]) {
        this.questionId = questionId;
        this.revisions = revisions;
    }

    public latestRevision(): Revision {
        const sorted = this.revisions.sort((r1, r2) => {
            return r1.revisionNumber - r2.revisionNumber;
        });
        return sorted[sorted.length - 1];
    }

    public addRevision(r: Revision): Question {
        this.revisions.push(r);
        return this;
    }

    public getRevisions(): Revision[] {
        return [...this.revisions];
    }
}

export class Revision {
    public readonly revisionNumber: number;
    public readonly revisionTime: Date;
    public readonly questionText: string;
    private scoreChoices: number[];

    constructor(revisionNumber: number, revisionTime: Date, text: string, choices: number[]) {
        this.revisionNumber = revisionNumber;
        this.revisionTime = revisionTime;
        this.questionText = text;
        this.scoreChoices = choices;
    }

    public getScoreChoices(): number[] {
        return [...this.scoreChoices];
    }
}

export interface UpdateQuestion {
    questionId: string;
    newRevisionNumber: number;
    text: string;
    scores: number[];
}