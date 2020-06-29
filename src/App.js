import React from 'react'
import {BrowserRouter as Router, Switch, Route, Redirect, Link} from 'react-router-dom'

import PeopleList from './components/People/List'
import PeopleDetails from './components/People/Details'

const App = () => <div className="app">
  <Router>
    <Switch>
      <Route exact path="/">
        <Redirect to="/people" />
      </Route>

      <Route exact path="/people" component={PeopleList} />
      <Route exact path="/people/:id" component={PeopleDetails} />
    </Switch>
  </Router>
</div>

export default App
