import { QuestionRepository } from "./questionRepository";
import { Question, UpdateQuestion, Revision } from "./question";
import { Optional } from "java8script";
import { NotFoundException, BadStateException } from "../exceptions";

export class QuestionService {
    private questionRepository: QuestionRepository;

    constructor(questionRepository: QuestionRepository) {
        this.questionRepository = questionRepository;
    }

    saveQuestion(question: Question): Promise<Question> {
        return this.questionRepository.saveQuestion(question);
    }

    async updateQuestion(updateQuestion: UpdateQuestion, requestTime: Date): Promise<Question> {
        const existingQuestion: Question = (await this.questionRepository.findQuestionById(updateQuestion.questionId))
            .orElseThrow(() => new NotFoundException(`cannot update question ${updateQuestion.questionId}, does not exist.`));

        if(existingQuestion.latestRevision().revisionNumber.valueOf() >= updateQuestion.newRevisionNumber) {
            throw new BadStateException(`revision ${updateQuestion.newRevisionNumber} has already been created for question ${updateQuestion.questionId}.`);
        } else {
            const updatedQuestion:Question = existingQuestion.addRevision(new Revision(updateQuestion.newRevisionNumber, requestTime, updateQuestion.text, updateQuestion.scores));
            return this.questionRepository.saveQuestion(updatedQuestion);
        }
    }

    findQuestions(): Promise<Array<Question>> {
        return this.questionRepository.findQuestions();
    }
}