import React, { useState, useEffect } from "react";
import { Message, Table, Label, Button, Header } from "semantic-ui-react";
import { getAllQuestions } from "../api";
import { Optional } from "java8script";
import EditQuestionModalButton from "./editModal"
import { QuestionSummary } from "../shared/api";

export interface Props {
    searchFilter: Optional<string>;
}

function questionMatchFilter(q: QuestionSummary, filter: string): boolean {
    return q.text.startsWith(filter);
}

const QuestionsApp: React.FC<Props> = (props) => {
    const [error, setError] = useState<string>();
    const [questions, setQuestions] = useState<QuestionSummary[]>([]);

    useEffect(() => {
        getAllQuestions()
            .then(q => setQuestions(q))
            .catch(e => setError("Problem Fetching Question List"));
    }, []);

    const updateEditedQuestion = (s: QuestionSummary):void => {
        const filterOutOld = questions.filter(q => q.id !== s.id);
        setQuestions([s, ...filterOutOld]);
    }

    const renderRow = (question: QuestionSummary) => {
        return <Table.Row>
            <Table.Cell>
                <Header>{question.text}</Header>
                {question.desc && <p>{question.desc}</p>}
            </Table.Cell>
            <Table.Cell collapsing>
                {question.scores.map(s => <Label>{s}</Label>)}
            </Table.Cell>
            <Table.Cell collapsing>
                <EditQuestionModalButton
                    handleUpdateQuestion={updateEditedQuestion}
                    questionId={question.id}
                />
                <Button color="red" onClick={() => { }}>Delete</Button>
            </Table.Cell>
        </Table.Row>;
    }

    const filteredQuestions = questions.filter(q => props.searchFilter.map(filter => questionMatchFilter(q, filter)).orElse(true));
    return (
        <>
            <h1>Questions</h1>
            {error &&
                <Message error>
                    <Message.Header>Problem with Operation!</Message.Header>
                    <p>{error}</p>
                </Message>
            }
            <Table celled padded>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>Question</Table.HeaderCell>
                        <Table.HeaderCell>Choices</Table.HeaderCell>
                        <Table.HeaderCell>Options</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {filteredQuestions.map(q => renderRow(q))}
                </Table.Body>
            </Table>
        </>
    );
}

export default QuestionsApp;