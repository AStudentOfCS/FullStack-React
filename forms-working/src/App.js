import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import ReduxApp from './forms/redux/redux-app';

//import Forms from './forms/Forms';
// import UsersInput from './forms/UsersInput';

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <ReduxApp />
      </div>
    );
  }
}

export default App;
