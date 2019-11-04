import React, { useState, ChangeEvent } from 'react'
import { Button, Modal, Form, Message } from 'semantic-ui-react'
import { createNewService } from '../api';
import { ServiceDTO, ServerError } from '../shared/api';

interface Props {
    handleNewService: (service: ServiceDTO) => void;
}

const CreateServiceModalButton: React.FC<Props> = (props) => {
    const [open, setOpen] = useState<boolean>(false);
    const [name, setName] = useState<string>();
    const [team, setTeam] = useState<string>();
    const [department, setDepartment] = useState<string>();
    const [errorMessage, setErrorMessage] = useState<string>();


    const handleChange = (setFunction: React.Dispatch<React.SetStateAction<string | undefined>>) => {
        return (event: ChangeEvent<HTMLInputElement>) => setFunction(event.target.value)
    }

    const isValid = (str: string | undefined): str is string => {
        return str !== undefined && str !== "";
    }

    const closeModal = () => {
        setErrorMessage(undefined);
        setOpen(false);
    }

    const handleSubmit = () => {
        if (isValid(name) && isValid(department) && isValid(team)) {
            createNewService({ name, team, department })
                .then(service => {
                    props.handleNewService(service);
                    closeModal();
                })
                .catch((err: ServerError) => setErrorMessage(err.message))
        }
    }

    return (
        <Modal
            open={open}
            trigger={<Button onClick={() => setOpen(true)} color="green">Create Service</Button>}>
            <Modal.Header>Create New Service</Modal.Header>
            <Modal.Content>
                {errorMessage && <Message error>
                    <Message.Header>Problem creating new Service</Message.Header>
                    <p>{errorMessage}</p>
                </Message>}
                <Form>
                    <Form.Input
                        fluid
                        label="Name"
                        onChange={handleChange(setName)}
                    />
                    <Form.Input
                        fluid
                        label="Team"
                        onChange={handleChange(setTeam)}
                    />
                    <Form.Input
                        fluid
                        label="Department"
                        onChange={handleChange(setDepartment)}
                    />
                </Form>
            </Modal.Content>
            <Modal.Actions>
                <Button color="green" onClick={handleSubmit}>Create</Button>
                <Button color="red" onClick={() => closeModal()}>Close</Button>
            </Modal.Actions>
        </Modal>
    )
}

export default CreateServiceModalButton;
