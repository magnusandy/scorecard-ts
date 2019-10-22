import React, { useState, useEffect } from "react";
import { Table, Header, Rating, Button } from "semantic-ui-react";
import { getAllServices, Service } from "../api";

const ServicesApp: React.FC = () => {
    const renderRow = (service: Service) => {
        return (
            <Table.Row>
                <Table.Cell>
                    <Header as='h2' textAlign='center'>
                        {service.name}
                    </Header>
                </Table.Cell>
                <Table.Cell singleLine>{service.owner}</Table.Cell>
                <Table.Cell singleLine>{service.vertical}</Table.Cell>
                <Table.Cell >
                    <Button color="orange">Edit</Button>
                    <Button color="red">Delete</Button>
                </Table.Cell>
            </Table.Row>
        );
    }
    const [services, setServices] = useState<Service[]>([]);

    useEffect(() => {
        setServices(getAllServices());
    }, []);

    return (
        <>
            <h1>Services</h1>
            <Table celled padded>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell singleLine>Service Name</Table.HeaderCell>
                        <Table.HeaderCell>Owner</Table.HeaderCell>
                        <Table.HeaderCell>Vertical</Table.HeaderCell>
                        <Table.HeaderCell>Options</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {services.map(s => renderRow(s))}
                </Table.Body>
            </Table>
        </>
    );
}

export default ServicesApp;