import React, { useState, ChangeEvent } from 'react'
import { Button, Header, Modal, Input, Grid, GridColumn, Form } from 'semantic-ui-react'
import { createNewService } from '../api';
import styled from 'styled-components';
import { ServiceDTO } from '../shared/dtos';

interface Props {
    handleNewService: (service: ServiceDTO) => void;
}

const CreateServiceModalButton: React.FC<Props> = (props) => {
    const [open, setOpen] = useState<boolean>(false);
    const [name, setName] = useState<string>();
    const [owner, setOwner] = useState<string>();
    const [vertical, setVertical] = useState<string>();

    const handleChange = (setFunction: React.Dispatch<React.SetStateAction<string | undefined>>) => {
        return (event: ChangeEvent<HTMLInputElement>) => setFunction(event.target.value)
    }

    const isValid = (str: string | undefined): str is string => {
        return str !== undefined && str !== "";
    }

    const handleSubmit = () => {
        if (isValid(name) && isValid(vertical) && isValid(owner)) {
            createNewService({ name, owner, vertical })
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
                        label="Owner"
                        onChange={handleChange(setOwner)}
                    />
                    <Form.Input
                        fluid
                        label="Vertical"
                        onChange={handleChange(setVertical)}
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
