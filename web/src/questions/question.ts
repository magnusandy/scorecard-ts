import { QuestionDTO, RevisionDTO } from "../shared/api";
export class Question {
    private id: string;
    private revisions: RevisionDTO[];

    private constructor(id: string, revisions: RevisionDTO[]) {
        this.id = id;
        this.revisions = revisions;
    }

    public static fromDTO(q: QuestionDTO): Question {
        return new Question(q.id, q.revisions);
    }

    public latestRevision(): RevisionDTO {
        const sorted = this.revisions.sort((r1, r2) => {
            return r1.revisionNumber - r2.revisionNumber;
        });
        return sorted[sorted.length - 1];
    }
}