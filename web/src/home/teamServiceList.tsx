import React, { useState } from "react";
import { Optional } from "java8script";
import styled from "styled-components";
import {Button} from "semantic-ui-react";

export interface Props {
    searchFilter: Optional<string>;
    teamName: string;
    clearTeam: () => void;
}

const FloatLeftH2 = styled.h2`
float: left;
margin-right: 10px;
`;
const TeamServiceList: React.FC<Props> = (props) => {
    const [error, setError] = useState<string>();
    return (
        <>
            <div>
            <FloatLeftH2>Current Team - {props.teamName}  </FloatLeftH2>
            <Button onClick={props.clearTeam} size="mini" color="red">X</Button>
            </div>
        </>
    );
}

export default TeamServiceList;