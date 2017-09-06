import React, { Component } from 'react';
import thunkMiddleware from 'redux-thunk';
import { connect, Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import { reducer } from './redux-reducer';
import { fetchPeople, savePeople } from './redux-actions';
import Form from './redux-form';

const store = createStore(reducer, applyMiddleware(thunkMiddleware));

const mapStateToProps = (state) => (
  {
    isLoading: state.isLoading,
    fields: state.person,
    people: state.people,
    saveStatus: state.saveStatus,
  }
);

const mapDispatchToProps = (dispatch) => (
  {
    onSubmit: (people) => {
      dispatch(savePeople(people));
    },
  }
);

const ReduxForm = connect(
  mapStateToProps,
  mapDispatchToProps
)(Form);

export default class ReduxApp extends Component {
  componentWillMount() {
    store.dispatch(fetchPeople());
  };

  render() {
    return (
      <Provider store={store}>
        <ReduxForm />
      </Provider>
    )
  }
}
