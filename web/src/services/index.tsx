import React, { useState, useEffect } from "react";
import { Table, Header, Button, Message } from "semantic-ui-react";
import { getAllServices, deleteService } from "../api";
import { Optional } from "java8script";
import EditServiceModalButton from "./editModal";
import CreateServiceModalButton from "./createModal";
import { ServiceDTO } from "../shared/dtos";

export interface Props {
    searchFilter: Optional<string>;
}

const serviceMatchesFilter = (filter: string, service: ServiceDTO): boolean => {
    return service.name.startsWith(filter) || service.team.startsWith(filter) || service.department.startsWith(filter);
}

const ServicesApp: React.FC<Props> = (props) => {

    const [services, setServices] = useState<ServiceDTO[]>([]);
    const [error, setError] = useState<string>();

    useEffect(() => {
        getAllServices()
            .then(services => setServices(services))
            .catch(e => setError("Problem Fetching ServiceDTO List"));
    }, []);

    const handleNewService = (service: ServiceDTO) => {
        setServices([...services, service]);
    }

    const handleUpdatedService = (updatedService: ServiceDTO) => {
        const filteredService = services.filter(s => s.id !== updatedService.id);
        setServices([updatedService, ...filteredService]);

    }

    const handleDelete = (service: ServiceDTO) => {
        deleteService(service.id)
            .then(() => {
                const filteredService = services.filter(s => s.id !== service.id);
                setServices(filteredService);
            })
            .catch(() => {
                setError(`unable to delete service ${service.name}`)
            });
    };

    const renderRow = (service: ServiceDTO) => {
        return (
            <Table.Row>
                <Table.Cell>
                    <Header as='h2' textAlign='center'>
                        {service.name}
                    </Header>
                </Table.Cell>
                <Table.Cell singleLine>{service.team}</Table.Cell>
                <Table.Cell singleLine>{service.department}</Table.Cell>
                <Table.Cell >
                    <EditServiceModalButton service={service} handleUpdateService={handleUpdatedService} />
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
                        <Table.HeaderCell singleLine>Name</Table.HeaderCell>
                        <Table.HeaderCell>Team</Table.HeaderCell>
                        <Table.HeaderCell>Department</Table.HeaderCell>
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