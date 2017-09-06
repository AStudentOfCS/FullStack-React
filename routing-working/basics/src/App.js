import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link,
  Redirect,
  Switch
} from 'react-router-dom';
// import createHistory from 'history/createBrowserHistory';
import './App.css';

// const Route = ({ path, component: Component }, { location }) => {
//   const pathname = location.pathname;
//   if (pathname.match(path)) {
//     return <Component />;
//   } else {
//     return null;
//   }
// };
//
// Route.contextTypes = {
//   location: React.PropTypes.object,
// };
//
// const Link = ({ to, children }, { history }) => (
//   <a
//     onClick={(e) => {
//       e.preventDefault();
//       history.push(to);
//     }}
//     href={to}
//   >
//     {children}
//   </a>
// );
//
// Link.contextTypes = {
//   history: React.PropTypes.object,
// }
//
// class Redirect extends Component {
//   static contextTypes = {
//     history: React.PropTypes.object,
//   }
//
//   componentDidMount() {
//     const history = this.context.history;
//     const to = this.props.to;
//     history.push(to);
//   }
//
//   render() {
//     return null;
//   }
// }
//
// class Router extends Component {
//   static childContextTypes = {
//     history: React.PropTypes.object,
//     location: React.PropTypes.object,
//   }
//
//   constructor(props) {
//     super(props);
//
//     this.history = createHistory();
//     this.history.listen(() => this.forceUpdate());
//   }
//
//   getChildContext() {
//     return {
//       history: this.history,
//       location: window.location,
//     };
//   }
//
//   render() {
//     return this.props.children;
//   }
// }

const App = () => (
  <Router>
    <div
      className='ui text container'
    >
      <h2 className='ui dividing header'>
        Which body of water?
      </h2>

      <ul>
        <li>
          <Link to='/atlantic'>
            <code>/atlantic</code>
          </Link>
        </li>
        <li>
          <Link to='/pacific'>
            <code>/pacific</code>
          </Link>
        </li>
        <li>
          <Link to='/black-sea'>
            <code>/black-sea</code>
          </Link>
        </li>
      </ul>
      <hr />
      <Switch>
        <Route path='/atlantic/ocean' render={() => (
          <div>
            <h3>Atlantic Ocean - Again!</h3>
            <p>Also known as "The Pond"</p>
          </div>
        )} />
        <Route path='/atlantic' component={Atlantic} />
        <Route path='/pacific' component={Pacific} />
        <Route path='/black-sea' component={BlackSea} />

        <Route exact path='/' render={() => (
          <h3>
            Welcome! Select a body of saline water above.
          </h3>
        )} />

        <Route render={({ location }) => (
          <div className='ui inverted red segment'>
            <h3>
              Error! No matches for <code>{location.pathname}</code>
            </h3>
          </div>
        )} />
      </Switch>
    </div>
  </Router>
);

const Atlantic = () => (
  <div>
    <h3>Atlantic Ocean</h3>
    <p>
      The Atlantic Ocean covers approximately 1/5th of the
      surface of the earth.
    </p>
  </div>
);

const Pacific = () => (
  <div>
    <h3>Pacific Ocean</h3>
    <p>
      Ferdinand Megellan, a Portuguese explorer, named the ocean
      'mar pacifico' in 1521, thich means peaceful sea.
    </p>
  </div>
);

class BlackSea extends Component {
  state = {
    counter: 3,
  };

  componentDidMount() {
    this.interval = setInterval(() => (
      this.setState({ counter: this.state.counter - 1 })
    ), 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    return (
      <div>
        <h3>Black Sea</h3>
        <p>Nothing to sea [sic] here ...</p>
        <p>Redirecting in {this.state.counter}...</p>
        {
          (this.state.counter < 1) ? <Redirect to='/' /> : null
        }
      </div>
    );
  }
}

export default App;
