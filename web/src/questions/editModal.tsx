import React, { useState, ChangeEvent, FormEvent } from 'react'
import { Button, Modal, Form, Message, Table, Header, Label, Grid } from 'semantic-ui-react'
import { RevisionDTO, QuestionSummary, ReviseQuestion } from '../shared/api';
import { formatDistance } from 'date-fns';
import { getRevisionsForQuestion, addNewRevision } from '../api';

interface Props {
    handleUpdateQuestion: (service: QuestionSummary) => void;
    questionId: string;
}

function renderRow(revision: RevisionDTO) {
    return (<Table.Row>
        <Table.Cell collapsing>
            {`${revision.revisionNumber}`}
        </Table.Cell>
        <Table.Cell>{revision.questionText}</Table.Cell>
        <Table.Cell>{revision.questionDescription ? revision.questionDescription : ""}</Table.Cell>
        <Table.Cell singleLine>
            {revision.scoreOptions.map(s => <Label>{s}</Label>)}
        </Table.Cell>
        <Table.Cell singleLine>{formatDistance(new Date(revision.revisionTime), new Date())}</Table.Cell>
    </Table.Row>);
}

const getLatestRevision = (revisions: RevisionDTO[]): RevisionDTO => {
    const sorted = revisions.sort((r1, r2) => {
        return r1.revisionNumber - r2.revisionNumber;
    });
    return sorted[sorted.length - 1];
}

const EditQuestionModalButton: React.FC<Props> = (props) => {
    const [open, setOpen] = useState<boolean>(false);
    const [error, setError] = useState<string>();
    const [revisions, setRevisions] = useState<RevisionDTO[]>([]);

    const [formError, setFormError] = useState<string>();
    const [formQuestion, setFormQuestion] = useState<string>("");
    const [formDesc, setFormDesc] = useState<string>();
    const [formScoreInputs, setFormScoreInput] = useState<number | "">("");
    const [formScores, setFormScores] = useState<number[]>([]);

    const closeModal = () => {
        setError(undefined);
        setOpen(false);
    }

    const updateChoiceInput = (event: ChangeEvent<HTMLInputElement>) => {
        const newVal = event.target.value;
        const stripped = newVal.replace(/\D/g, '');

        const asNumber = parseInt(stripped);
        if (asNumber) {
            setFormScoreInput(asNumber);
        } else {
            setFormScoreInput("");
        }

    }

    const addChoice = () => {
        if (formScoreInputs !== "") {
            const newVal = formScores.findIndex(f => f === formScoreInputs) === -1;
            if (newVal) {
                setFormScores([formScoreInputs, ...formScores]);
                setFormScoreInput("");
            }
        }
    }

    const removeChoice = (choice: number) => {
        return () => {
            const filtered = formScores.filter(s => s !== choice);
            setFormScores(filtered);
        }
    }

    const openModal = () => {
        setRevisions([]);
        getRevisionsForQuestion(props.questionId)
            .then(revisions => {
                setRevisions(revisions);
                const latest = getLatestRevision(revisions);
                setFormDesc(latest.questionDescription);
                setFormQuestion(latest.questionText);
                setFormScores(latest.scoreOptions);
                setOpen(true);

            })
            .catch(e => setError(`${e}`))
    }

    const validate = (): string | undefined => {
        if (!formQuestion) {
            return "Question needed";
        }
        if (formScores.length === 0) {
            return "At least one score choice is needed";
        }
        return undefined;
    }

    const submitButtonPressed = () => {
        const error = validate();
        if (error) {
            setFormError(error);
        } else {
            setFormError(undefined);
            const newRevision: ReviseQuestion = {
                revisionNumber: getLatestRevision(revisions).revisionNumber + 1,
                text: formQuestion,
                desc: formDesc,
                scores: formScores
            }
            addNewRevision(props.questionId, newRevision)
                .then(questionDto => {
                    const latest:RevisionDTO = getLatestRevision(questionDto.revisions);
                    const summary: QuestionSummary = {
                        id: questionDto.id,
                        text: latest.questionText,
                        desc: latest.questionDescription,
                        scores:latest.scoreOptions
                    };
                    props.handleUpdateQuestion(summary);
                })
                .then(_ => closeModal())
                .catch(er => setFormError(`${er}`));
        }
    }

    return (
        <Modal
            open={open}
            trigger={<Button onClick={() => openModal()} color="orange">Edit</Button>}>
            <Modal.Header>Edit Question</Modal.Header>
            <Modal.Content>
                {error && <Message error>
                    <Message.Header>Problem editing question</Message.Header>
                    <p>{error}</p>
                </Message>}
                <Header>Question History</Header>
                <Table celled padded>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>#</Table.HeaderCell>
                            <Table.HeaderCell>Question</Table.HeaderCell>
                            <Table.HeaderCell>Description</Table.HeaderCell>
                            <Table.HeaderCell>Choices</Table.HeaderCell>
                            <Table.HeaderCell>Created Time</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {revisions.map(q => renderRow(q))}
                    </Table.Body>
                </Table>
                <Header>Add Question Revision</Header>
                {formError && <Message error>
                    <Message.Header>Problem editing question</Message.Header>
                    <p>{formError}</p>
                </Message>}
                <Form>
                    <Form.Input
                        fluid
                        label="Question"
                        value={formQuestion}
                        onChange={(event: ChangeEvent<HTMLInputElement>) => setFormQuestion(event.target.value)}
                    />
                    <Form.TextArea
                        fluid
                        label="Description"
                        value={formDesc}
                        onChange={(event: any) => setFormDesc(event.target.value)}
                    />
                    <Grid>
                        <Grid.Row>
                            <Grid.Column width={8}>
                                <Form.Input
                                    fluid
                                    label="Enter new choice"
                                    placeholder="Enter a number..."
                                    value={formScoreInputs}
                                    onChange={updateChoiceInput}
                                />

                            </Grid.Column>
                            <Grid.Column width={8}>
                                <Form.Button
                                    label="Add choice"
                                    color="green"
                                    onClick={addChoice}
                                >+</Form.Button>
                            </Grid.Column>
                        </Grid.Row>
                        {formScores.map(score => <Grid.Row>
                            <Grid.Column width={1}>
                                <Label>{score}</Label>
                            </Grid.Column>
                            <Grid.Column width={1}>
                                <Button
                                    size="mini"
                                    color="red"
                                    onClick={removeChoice(score)}
                                >x</Button>
                            </Grid.Column>

                        </Grid.Row>)}
                    </Grid>

                </Form>
            </Modal.Content>
            <Modal.Actions>
                <Button color="green" onClick={submitButtonPressed}>Update</Button>
                <Button color="red" onClick={() => closeModal()}>Close</Button>
            </Modal.Actions>
        </Modal>
    )
}

export default EditQuestionModalButton;
