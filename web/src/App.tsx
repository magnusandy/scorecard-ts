import React from 'react';
import { Menu } from "semantic-ui-react";
import { Link, BrowserRouter as Router, Switch, Route } from "react-router-dom";
import ServicesApp from './services';
import QuestionsApp from './questions';

const App: React.FC = () => {
  return (
    <Router>
        <Menu>
          <Menu.Item
            name='services'
            active={false}
            content={<Link to="/services">Services</Link>}
            onClick={() => { }}
          />
          <Menu.Item
            name='questions'
            active={false}
            content={<Link to="/questions">Questions</Link>}
            onClick={() => { }}
          />
        </Menu>

      <Switch>
        <Route path="/services">
          <ServicesApp/>
        </Route>
        <Route path="/questions">
          <QuestionsApp/>
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
