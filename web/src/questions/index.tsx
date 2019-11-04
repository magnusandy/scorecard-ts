import React, { useState, useEffect } from "react";
import { Message, Table, Label, Button, Header } from "semantic-ui-react";
import { getAllQuestions } from "../api";
import { Question } from "./question";
import { Optional } from "java8script";

export interface Props {
    searchFilter: Optional<string>;
}

function questionMatchFilter(q: Question, filter: string): boolean {
    const latest = q.latestRevision();
    return latest.questionText.startsWith(filter);
}

const QuestionsApp: React.FC<Props> = (props) => {
    const [error, setError] = useState<string>();
    const [questions, setQuestions] = useState<Question[]>([]);

    useEffect(() => {
        getAllQuestions()
            .then(q => setQuestions(q))
            .catch(e => setError("Problem Fetching Question List"));
    }, []);

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

const renderRow = (question: Question) => {
    const latestRevision = question.latestRevision();
    return <Table.Row>
        <Table.Cell>
            <Header>{latestRevision.questionText}</Header>
            {latestRevision.questionDescription && <p>{latestRevision.questionDescription}</p>}
        </Table.Cell>
        <Table.Cell collapsing>
            {latestRevision.scoreOptions.map(s => <Label>{s}</Label>)}
        </Table.Cell>
        <Table.Cell collapsing>
            <Button onClick={() => { }}>History</Button>
            <Button color="orange" onClick={() => { }}>Edit</Button>
            <Button color="red" onClick={() => { }}>Delete</Button>
        </Table.Cell>
    </Table.Row>;
}

export default QuestionsApp;