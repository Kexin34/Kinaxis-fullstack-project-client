import React from 'react'
import {BrowserRouter, Route, Switch} from 'react-router-dom'

import Login from './pages/login/login'
import Routes from './pages/routeList/routes'

const App = (props) => {
  return (
    <BrowserRouter>
      <Switch>
        <Route path='/login' component={Login}></Route>
        <Route path='/' component={Routes}></Route>
      </Switch>
    </BrowserRouter>
  )
}
export default App;

