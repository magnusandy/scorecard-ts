import React, { useState, ChangeEvent } from 'react'
import { Button, Modal, Form } from 'semantic-ui-react'
import { updateService } from '../api';
import { ServiceDTO } from '../shared/dtos';

interface Props {
    handleUpdateService: (service: ServiceDTO) => void;
    service: ServiceDTO;
}

const EditServiceModalButton: React.FC<Props> = (props) => {
    const [open, setOpen] = useState<boolean>(false);
    const [team, setteam] = useState<string>(props.service.team);
    const [department, setdepartment] = useState<string>(props.service.department);

    const handleChange = (setFunction: React.Dispatch<React.SetStateAction<string>>) => {
        return (event: ChangeEvent<HTMLInputElement>) => setFunction(event.target.value)
    }

    const isValid = (str: string | undefined): str is string => {
        return str !== undefined && str !== "";
    }

    const handleSubmit = () => {
        if (isValid(department) && isValid(team)) {
            const id = props.service.id;
            updateService({ id, team, department })
                .then(service => {
                    props.handleUpdateService(service);
                    setOpen(false);
                })
                .catch(err => console.log(err))
        }
    }

    return (
        <Modal
            open={open}
            trigger={<Button onClick={() => setOpen(true)} color="orange">Edit</Button>}>
            <Modal.Header>Edit Service</Modal.Header>
            <Modal.Content>
                <Form>
                    <Form.Input
                        fluid
                        disabled
                        label="Name"
                        value={props.service.name}
                    />
                    <Form.Input
                        fluid
                        label="Team"
                        onChange={handleChange(setteam)}
                        value={team}
                    />
                    <Form.Input
                        fluid
                        label="Department"
                        onChange={handleChange(setdepartment)}
                        value={department}
                    />
                </Form>
            </Modal.Content>
            <Modal.Actions>
                <Button color="green" onClick={handleSubmit}>Update</Button>
                <Button color="red" onClick={() => setOpen(false)}>Close</Button>
            </Modal.Actions>
        </Modal>
    )
}

export default EditServiceModalButton;
