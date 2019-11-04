import { Question } from "./question";
import { Optional } from "java8script";

export interface QuestionRepository {
    saveQuestion: (question: Question) => Promise<Question>;
    findQuestionById:(questionId: string) => Promise<Optional<Question>>;
    findQuestions: () => Promise<Question[]>;
}