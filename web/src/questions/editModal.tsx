import React, { useState, ChangeEvent } from 'react'
import { Button, Modal, Form, Message, Table, Header, Label } from 'semantic-ui-react'
import { Question } from './question';
import { RevisionDTO } from '../shared/api';
import { formatDistance } from 'date-fns';

interface Props {
    handleUpdateQuestion: (service: Question) => void;
    question: Question;
}

function renderRow(revision: RevisionDTO) {
    console.log(revision.questionDescription);
    return (<Table.Row>
        <Table.Cell collapsing>
            {`${revision.revisionNumber}`}
        </Table.Cell>
        <Table.Cell>{revision.questionText}</Table.Cell>
        <Table.Cell>{revision.questionDescription? revision.questionDescription : ""}</Table.Cell>
        <Table.Cell singleLine>
            {revision.scoreOptions.map(s => <Label>{s}</Label>)}
        </Table.Cell>
        <Table.Cell singleLine>{formatDistance(new Date(revision.revisionTime), new Date())}</Table.Cell>
    </Table.Row>);
}

const EditQuestionModalButton: React.FC<Props> = (props) => {
    const [open, setOpen] = useState<boolean>(false);
    const [error, setError] = useState<string>();

    const closeModal = () => {
        setError(undefined);
        setOpen(false);
    }

    return (
        <Modal
            open={open}
            trigger={<Button onClick={() => setOpen(true)} color="orange">Edit</Button>}>
            <Modal.Header>Edit Question</Modal.Header>
            <Modal.Content>
                {error && <Message error>
                    <Message.Header>Problem creating new Question</Message.Header>
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
                        {props.question.getOrderedRevisions().map(q => renderRow(q))}
                    </Table.Body>
                </Table>
                <Header>Add Question Revision</Header>
                <Form>
                    <Form.Input
                        fluid
                        label="Question"
                    />
                    <Form.Input
                        fluid
                        label="Description"
                    />
                    <Form.Input
                        fluid
                        label="Choices"
                    />
                </Form>
            </Modal.Content>
            <Modal.Actions>
                <Button color="green" onClick={() => {}}>Update</Button>
                <Button color="red" onClick={() => closeModal()}>Close</Button>
            </Modal.Actions>
        </Modal>
    )
}

export default EditQuestionModalButton;
