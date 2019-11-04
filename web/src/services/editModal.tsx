import React, { useState, ChangeEvent } from 'react'
import { Button, Modal, Form, Message } from 'semantic-ui-react'
import { updateService } from '../api';
import { ServiceDTO, ServerError } from '../shared/api';

interface Props {
    handleUpdateService: (service: ServiceDTO) => void;
    service: ServiceDTO;
}

const EditServiceModalButton: React.FC<Props> = (props) => {
    const [open, setOpen] = useState<boolean>(false);
    const [name, setName] = useState<string>(props.service.name);
    const [team, setTeam] = useState<string>(props.service.team);
    const [error, setError] = useState<string>();
    const [department, setDepartment] = useState<string>(props.service.department);

    const handleChange = (setFunction: React.Dispatch<React.SetStateAction<string>>) => {
        return (event: ChangeEvent<HTMLInputElement>) => setFunction(event.target.value)
    }

    const isValid = (str: string | undefined): str is string => {
        return str !== undefined && str !== "";
    }

    const closeModal = () => {
        setError(undefined);
        setOpen(false);
    }

    const handleSubmit = () => {
        if (isValid(name) && isValid(department) && isValid(team)) {
            const id = props.service.id;
            updateService({ name, id, team, department })
                .then(service => {
                    props.handleUpdateService(service);
                    closeModal();
                })
                .catch((err: ServerError) => setError(err.message))
        }
    }

    return (
        <Modal
            open={open}
            trigger={<Button onClick={() => setOpen(true)} color="orange">Edit</Button>}>
            <Modal.Header>Edit Service</Modal.Header>
            <Modal.Content>
                {error && <Message error>
                    <Message.Header>Problem creating new Service</Message.Header>
                    <p>{error}</p>
                </Message>}
                <Form>
                    <Form.Input
                        fluid
                        label="Name"
                        onChange={handleChange(setName)}
                        value={name}
                    />
                    <Form.Input
                        fluid
                        label="Team"
                        onChange={handleChange(setTeam)}
                        value={team}
                    />
                    <Form.Input
                        fluid
                        label="Department"
                        onChange={handleChange(setDepartment)}
                        value={department}
                    />
                </Form>
            </Modal.Content>
            <Modal.Actions>
                <Button color="green" onClick={handleSubmit}>Update</Button>
                <Button color="red" onClick={() => closeModal()}>Close</Button>
            </Modal.Actions>
        </Modal>
    )
}

export default EditServiceModalButton;
