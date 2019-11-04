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
    const [owner, setOwner] = useState<string>(props.service.owner);
    const [vertical, setVertical] = useState<string>(props.service.vertical);

    const handleChange = (setFunction: React.Dispatch<React.SetStateAction<string>>) => {
        return (event: ChangeEvent<HTMLInputElement>) => setFunction(event.target.value)
    }

    const isValid = (str: string | undefined): str is string => {
        return str !== undefined && str !== "";
    }

    const handleSubmit = () => {
        if (isValid(vertical) && isValid(owner)) {
            const id = props.service.id;
            updateService({ id, owner, vertical })
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
                        label="Owner"
                        onChange={handleChange(setOwner)}
                        value={owner}
                    />
                    <Form.Input
                        fluid
                        label="Vertical"
                        onChange={handleChange(setVertical)}
                        value={vertical}
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
