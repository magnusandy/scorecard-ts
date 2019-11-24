import React, { useState } from 'react';
import { Link, BrowserRouter as Router, Switch, Route } from "react-router-dom";
import ServicesApp from './services';
import QuestionsApp from './questions';
import styled from 'styled-components';
import MainBar from './root/mainBar';
import { Optional } from "java8script";
import HomeApp from "./home"

const PaddedDiv = styled.div`
  margin: 16px;
`;


const App: React.FC = () => {
  const [search, setSearch] = useState<Optional<string>>(Optional.empty());

  const mapSearchValueToState = (val: string | null): Optional<string> => {
    if (val === null || val === "") {
      return Optional.empty();
    } else {
      return Optional.of(val);
    }
  }
  return (
    <Router>
      <MainBar
        searchChanged={(val) => setSearch(mapSearchValueToState(val))}
      />
      <Switch>
        <Route path="/services">
          <PaddedDiv>
            <ServicesApp
              searchFilter={search} />
          </PaddedDiv>
        </Route>
        <Route path="/questions">
          <PaddedDiv>
            <QuestionsApp searchFilter={search} />
          </PaddedDiv>
        </Route>
        <Route path="/">
          <PaddedDiv>
            <HomeApp
              searchFilter={search} />
          </PaddedDiv>
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
