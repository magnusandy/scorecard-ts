import React, { useState, useEffect } from "react";
import { QuestionDTO } from "../shared/api"
import { Message, Table, Label, Button } from "semantic-ui-react";
import { getAllQuestions } from "../api";
import { Question } from "./question";
const QuestionsApp: React.FC = () => {
    const [error, setError] = useState<string>();
    const [questions, setQuestions] = useState<Question[]>([]);

    useEffect(() => {
        getAllQuestions()
            .then(q => setQuestions(q))
            .catch(e => setError("Problem Fetching Question List"));
    }, []);

    return (
        <>
            <h1>Questions</h1>
            {error &&
                <Message error>
                    <Message.Header>Problem with Operation!</Message.Header>
                    <p>{error}</p>
                </Message>
            }
            <Table celled padded fixed>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>Question</Table.HeaderCell>
                        <Table.HeaderCell>Choices</Table.HeaderCell>
                        <Table.HeaderCell>Options</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {questions.map(q => renderRow(q))}
                </Table.Body>
            </Table>
        </>
    );
}

const renderRow = (question: Question) => {
    const latestRevision = question.latestRevision();
    return <Table.Row>
        <Table.Cell>
            {latestRevision.questionText}
        </Table.Cell>
        <Table.Cell>
            {latestRevision.scoreOptions.map(s => <Label>{s}</Label>)}
        </Table.Cell>
        <Table.Cell>
            <Button onClick={() => { }}>History</Button>
            <Button color="orange" onClick={() => { }}>Edit</Button>
            <Button color="red" onClick={() => { }}>Delete</Button>
        </Table.Cell>
    </Table.Row>;
}

export default QuestionsApp;