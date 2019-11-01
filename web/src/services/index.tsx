import React, { useState, useEffect } from "react";
import { Table, Header, Rating, Button, Message } from "semantic-ui-react";
import { getAllServices, Service, deleteService, updateService } from "../api";
import { Optional } from "java8script";
import EditServiceModalButton from "./editModal";
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

    const handleUpdatedService = (updatedService:Service) => {
        const filteredService = services.filter(s => s.id !== updatedService.id);
        setServices([updatedService, ...filteredService]);

    }

    const handleDelete = (service: Service) => {
        deleteService(service.id)
            .then(() => {
                const filteredService = services.filter(s => s.id !== service.id);
                setServices(filteredService);
            })
            .catch(() => {
                setError(`unable to delete service ${service.name}`)
            });
    };

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
                    <EditServiceModalButton service={service} handleUpdateService={handleUpdatedService}/>
                    <Button color="red" onClick={() => handleDelete(service)}>Delete</Button>
                </Table.Cell>
            </Table.Row>
        );
    }

    const filteredServices = services.filter((service) =>
        props.searchFilter.map(filter => serviceMatchesFilter(filter, service)).orElse(true));

    return (
        <>
            <h1>Services</h1>
            <CreateServiceModalButton handleNewService={handleNewService} />

            {error &&
                <Message warning>
                    <Message.Header>Problem with Operation!</Message.Header>
                    <p>{error}</p>
                </Message>
            }
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