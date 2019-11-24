import React, { useState, useEffect } from "react";
import { Optional } from "java8script";
import cookie from "react-cookies";
import { Input, Dropdown, Loader, Button } from "semantic-ui-react";
import styled from "styled-components";
import { getTeamList } from "../api";

const COOKIE_NAME = "teamDetails";

interface Props {
    searchFilter: Optional<string>;
}

interface TeamDetailsCookie {
    teamName: string;
}

const getTeamCookie = (): Optional<string> => {
    return Optional.ofNullable(cookie.load(COOKIE_NAME) as TeamDetailsCookie)
        .map(cookie => cookie.teamName);
}

const CenteredContextDiv = styled.div`
text-align: center;
`;

const PaddedDiv = styled.div`
padding:8px;
`;

const HomeApp: React.FC<Props> = (props) => {
    const [error, setError] = useState<string>();
    const [loading, setLoading] = useState<boolean>(true);
    const [currentTeam, setCurrentTeam] = useState<Optional<string>>(Optional.empty());
    const [teamList, setTeamList] = useState<string[]>([]);
    const [teamSearch, setTeamSearch] = useState<string>();

    useEffect(() => {
        const teamCookie: Optional<string> = getTeamCookie();
        if (!teamCookie.isPresent()) {
            getTeamList()
                .then(list => {
                    setTeamList(list);
                    setLoading(false);
                })
                .catch(err => {
                    setError("Something happened when fetching team list");
                })
        } else {
            setCurrentTeam(teamCookie);
            setLoading(false);
        }
    }, []);

    const onConfirm = () => {
        if(teamSearch) {
            const cookieVal:TeamDetailsCookie = {
                teamName: teamSearch,
            };
            cookie.save(COOKIE_NAME, cookieVal, {path:"/"})
            setCurrentTeam(Optional.of(teamSearch));
        }
    }

    return (
        <>
            <h1>Scorecard</h1>
            <Loader active={loading} />
            {!loading && !currentTeam.isPresent() &&
                <>
                    <CenteredContextDiv>
                        <h2>Welcome to the team scorecard tracker!</h2>
                        <h2>Which team are you a part of?</h2>
                        <Dropdown search selection 
                        placeholder="Team Name" 
                        options={teamList.map(t => ({ key: t, text: t, value: t }))}
                        onChange={(e, d) => setTeamSearch(`${d.value}`)}
                        />
                        <PaddedDiv>
                            <Button color="green" onClick={onConfirm}>Confirm</Button>
                        </PaddedDiv>
                    </CenteredContextDiv>
                </>
            }
        </>
    );
}

export default HomeApp;