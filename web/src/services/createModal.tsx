import React, { useState, ChangeEvent } from 'react'
import { Button, Header, Modal, Input, Grid, GridColumn, Form } from 'semantic-ui-react'
import { createNewService } from '../api';
import { ServiceDTO } from '../shared/dtos';

interface Props {
    handleNewService: (service: ServiceDTO) => void;
}

const CreateServiceModalButton: React.FC<Props> = (props) => {
    const [open, setOpen] = useState<boolean>(false);
    const [name, setName] = useState<string>();
    const [team, setteam] = useState<string>();
    const [department, setDepartment] = useState<string>();

    const handleChange = (setFunction: React.Dispatch<React.SetStateAction<string | undefined>>) => {
        return (event: ChangeEvent<HTMLInputElement>) => setFunction(event.target.value)
    }

    const isValid = (str: string | undefined): str is string => {
        return str !== undefined && str !== "";
    }

    const handleSubmit = () => {
        if (isValid(name) && isValid(department) && isValid(team)) {
            createNewService({ name, team, department })
                .then(service => {
                    props.handleNewService(service);
                    setOpen(false);
                })
                .catch(err => console.log(err))
        }
    }

    return (
        <Modal
            open={open}
            trigger={<Button onClick={() => setOpen(true)} color="green">Create Service</Button>}>
            <Modal.Header>Create New Service</Modal.Header>
            <Modal.Content>
                <Form>
                    <Form.Input
                        fluid
                        label="Name"
                        onChange={handleChange(setName)}
                    />
                    <Form.Input
                        fluid
                        label="team"
                        onChange={handleChange(setteam)}
                    />
                    <Form.Input
                        fluid
                        label="department"
                        onChange={handleChange(setDepartment)}
                    />
                </Form>
            </Modal.Content>
            <Modal.Actions>
                <Button color="green" onClick={handleSubmit}>Create</Button>
                <Button color="red" onClick={() => setOpen(false)}>Close</Button>
            </Modal.Actions>
        </Modal>
    )
}

export default CreateServiceModalButton;
