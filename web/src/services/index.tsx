import React, { useState, useEffect } from "react";
import { Table, Header, Rating, Button } from "semantic-ui-react";
import { getAllServices, Service } from "../api";
import { Optional } from "java8script";
import CreateServiceModalButton from "./createModal";

export interface Props {
    searchFilter: Optional<string>;
}

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

const serviceMatchesFilter = (filter: string, service: Service): boolean => {
    return service.name.startsWith(filter) || service.owner.startsWith(filter) || service.vertical.startsWith(filter);
}

const ServicesApp: React.FC<Props> = (props) => {

    const [services, setServices] = useState<Service[]>([]);
    const [error, setError] = useState<string>();

    useEffect(() => {
        getAllServices()
        .then(services => setServices(services))
        .catch(e => setError("Problem Fetching Service List"));
    }, []);

    const handleNewService = (service: Service) => {
        setServices([...services, service]);
    } 

    console.log(services);
    const filteredServices = services.filter((service) =>
        props.searchFilter.map(filter => serviceMatchesFilter(filter, service)).orElse(true));
    
    return (
        <>
            <h1>Services</h1>
            <CreateServiceModalButton handleNewService={handleNewService}/>
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
                    {filteredServices.map(s => renderRow(s))}
                </Table.Body>
                {error && <p>{error}</p>}
            </Table>
        </>
    );
}

export default ServicesApp;