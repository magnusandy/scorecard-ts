import { QuestionRepository } from "../../domain/questions/questionRepository"
import { Firestore, CollectionReference, DocumentReference, DocumentSnapshot, DocumentData, Query } from "@google-cloud/firestore";
import { Question, Revision } from "../../domain/questions/question";
import { Optional } from "java8script";
import { UnknownException } from "../../domain/exceptions"

interface SerializedRevision {
    revisionNumber: number;
    revisionTime: number; //timestamp
    questionText: string;
    description?: string;
    scoreChoices: number[];
}

interface SerializedQuestion {
    id: string;
    revisions: SerializedRevision[]
}

const id = "id";
const revisions = "revisions";
const revisionNumber = "revisionNumber";
const revisionTime = "revisionTime";
const questionText = "questionText";
const description = "description";
const scoreChoices = "scoreChoices";

export function serializeQuestion(question: Question): SerializedQuestion {
    return {
        [id]: question.questionId,
        [revisions]: question.getRevisions().map(r => serializeRevision(r))
    }
}

function serializeRevision(revision: Revision): SerializedRevision {
    const serialized = {
        [revisionNumber]: revision.revisionNumber,
        [revisionTime]: revision.revisionTime.valueOf(),
        [questionText]: revision.questionText,
        [scoreChoices]: revision.getScoreChoices(),
    };
    revision.questionDescription.ifPresent(desc => serialized[description] = desc);
    return serialized;
}

export function deserializeQuestion(data: any): Question {
    const serializedQuestion = data as SerializedQuestion;
    return new Question(
        serializedQuestion.id,
        serializedQuestion.revisions.map(r => new Revision(r.revisionNumber,
            new Date(r.revisionTime),
            r.questionText,
            r.scoreChoices,
            Optional.ofNullable(r.description))
        ));
}

export class FirestoreQuestionRepository implements QuestionRepository {
    private firestore: Firestore;
    private questionCollection: CollectionReference;

    public constructor(firestore: Firestore) {
        this.firestore = firestore;
        this.questionCollection = this.firestore.collection("Questions");
    }

    public async saveQuestion(question: Question): Promise<Question> {
        const questionRef: DocumentReference = this.questionCollection.doc(question.questionId);
        await questionRef.set(serializeQuestion(question))
        return question;
    }

    public findQuestionById(questionId: string): Promise<Optional<Question>> {
        const questionRef = this.questionCollection.doc(questionId);
        return questionRef.get()
            .then(this.deserializeQuestion)
            .catch(err => {
                throw new UnknownException(`error findQuestionById: \n ${JSON.stringify(err)}`);
            });
    }

    public findQuestions(): Promise<Question[]> {
        return this.questionCollection.get()
            .then(snap => snap.docs
                .map(this.deserializeQuestion)
                .filter(q => q.isPresent())
                .map(q => q.get()))
            .catch(err => {
                throw new UnknownException(`error findQuestions: \n ${JSON.stringify(err)}`);
            })


    };

    private deserializeQuestion(snap: DocumentSnapshot): Optional<Question> {
        if (snap.exists) {
            const data: DocumentData = snap.data();
            const serializedQuestion = data as SerializedQuestion;
            return Optional.of(new Question(
                serializedQuestion.id,
                serializedQuestion.revisions.map(r => new Revision(r.revisionNumber,
                    new Date(r.revisionTime),
                    r.questionText,
                    r.scoreChoices,
                    Optional.ofNullable(r.description))
                )));
        } else {
            return Optional.empty();
        }
    }
}