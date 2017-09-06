import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { isEmail } from 'validator';
import Field from './Field';
import CourseSelect from './CourseSelect';
import { createStore, applyMiddleware } from 'redux';
import { reducer, fetchPeople, savePeople } from './redux-actions';
import { connect, Provider } from 'react-redux';
import thunkMiddleware from 'redux-thunk';

const store = createStore(reducer, applyMiddleware(thunkMiddleware));

class Form extends Component {
  static propTypes = {
    people: PropTypes.array.isRequired,
    isLoading: PropTypes.bool.isRequired,
    saveStatus: PropTypes.string.isRequired,
    fields: PropTypes.object,
    onSubmit: PropTypes.func.isRequired,
  };

  state = {
    fields: this.props.fields || {
      name: '',
      email: '',
      course: null,
      department: null,
    },
    fieldErrors: {},
  };

  componentWillReceiveProps(update) {
    console.log(`this.props.fields ${this.props.fields} ${update}`);
    this.setState({ fields: update.fields });
  };

  onFormSubmit(e) {
    const person = this.state.fields;
    e.preventDefault();
    if (this.validate()) return;
    this.props.onSubmit([ ...this.props.people, person ]);
  };

  onInputChange({ name, value, error }) {
    const fields = this.state.fields;
    const fieldErrors = this.state.fieldErrors;

    fields[name] = value;
    fieldErrors[name] = error;

    this.setState({ fields, fieldErrors, _saveStatus: 'READY' });
  };

  validate() {
    const person = this.state.fields;
    const fieldErrors = this.state.fieldErrors;
    const errMessages = Object.keys(fieldErrors).filter((k) => fieldErrors[k]);

    if (!person.name) return true;
    if (!person.email) return true;
    if (!person.course) return true;
    if (!person.department) return true;
    if (errMessages.length) return true;

    return false;
  };

  render() {
    if (this.props.isLoading) {
      return <img alt='loading' src='img/loading.gif' />;
    };

    const dirty = Object.keys(this.state.fields).length;
    let status = this.props.saveStatus;

    if (status === 'SUCCESS' && dirty) {
      status = 'READY';
    };

    return (
      <div>
        <h1>Sign Up Sheet</h1>

        <form onSubmit={this.onFormSubmit}>
          <Field
            placeholder='Name'
            name='name'
            value={this.state.fields.name}
            onChange={this.onInputChange}
            validate={(val) => (val ? false: 'Name Required')}
          />
          <br />
          <Field
            placeholder='Email'
            name='email'
            value={this.state.fields.email}
            onChange={this.onInputChange}
            validate={(val) => {isEmail(val) ? false: 'Invalid Email'}}
          />
          <br />
          <CourseSelect
            department={this.state.fields.department}
            course={this.state.fields.course}
            onChange={this.onInputChange}
          />
          <br />
          {
            {
              SAVING: <input value='Saving...' type='submit' disabled />,
              SUCCESS: <input value='Saved!' type='submit' disabled />,
              ERROR: <input
                value='Save Failed - Retry?'
                type='submit'
                disabled={this.validate()}
              />,
              READY: <input
                value='Submit'
                type='submit'
                disabled={this.validate()}
              />,
            }[status]
          }
        </form>
        <div>
          <h3>People List</h3>
          <ul>
            {this.props.people.map(({ name, email, department, course }, i) =>
              <li key={i}>{[ name, email, department, course ].join(' = ')}</li>
            )}
          </ul>
        </div>
      </div>
    )
  };
}

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

export default class FinishForm extends Component {
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
