import { QuestionRepository } from "../../domain/questions/questionRepository"
import { Question } from "../../domain/questions/question";
import StubDB from "../stubDB";
import { Optional } from "java8script";
import { serializeQuestion, deserializeQuestion } from "./firestoreQuestionRepository";
export default class StubQuestionRepository implements QuestionRepository {

    private db: StubDB<Question>;

    constructor(persistant: boolean) {
        this.db = new StubDB(persistant, require("path").resolve(__dirname, "./stubDB.json"),
        (q) => JSON.stringify(serializeQuestion(q)),
        (str) => deserializeQuestion(JSON.parse(str)));
    }

    saveQuestion = (question: Question): Promise<Question> => {
        this.db.writeDB([question, ...this.db.getDB()]);
        return Promise.resolve(question);
    };

    findQuestionById = (questionId: string): Promise<Optional<Question>> => {
        const q = this.db.getDB().find(q => q.questionId === questionId);
        return Promise.resolve(Optional.ofNullable(q));
    };
    findQuestions = (): Promise<Question[]> => {
        return Promise.resolve(this.db.getDB());
    };
}