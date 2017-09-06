import React from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';
import TopBar from './components/TopBar';
import PrivateRoute from './components/PrivateRoute';
import AlbumsContainer from './components/AlbumsContainer';
import Login from './components/Login';
import Logout from './components/Logout';
import './styles/App.css';

const App = () => (
  <div className='ui grid'>
    <TopBar />
    <div className='spacer row' />
    <div className='row'>
    <Switch>
      <PrivateRoute path='/albums' component={AlbumsContainer} />

      <Route path='/login' component={Login} />
      <Route path='/logout' component={Logout} />

      <Route exact path='/' render={() => (
        <Redirect
          to='/albums'
        />
      )}
      />
      </Switch>
    </div>
  </div>
);

export default App;
