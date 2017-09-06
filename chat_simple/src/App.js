import React, { Component } from 'react';
import { createStore, combineReducers } from 'redux';
import { Provider, connect } from 'react-redux';
import uuid from 'uuid';

// Reducers set up
const activeThreadIdReducer = (state = '1-fca2', action) => {
  if (action.type === 'OPEN_THREAD') {
    return action.id;
  } else {
    return state;
  }
};

const findThreadIndex = (threads, action) => {
  switch (action.type) {
    case 'ADD_MESSAGE':
      return threads.findIndex(t => t.id === action.threadId);
    case 'DELETE_MESSAGE':
      return threads.findIndex(t => t.messages.find(
        m => m.id === action.id
      ));
  }
};

const threadsReducer = (state = [
  {
    id: '1-fca2',
    title: 'Buzz Aldrin',
    messages: messagesReducer(undefined, {}),
  },
  {
    id: '2-be91',
    title: 'Michael Collins',
    messages: messagesReducer(undefined, {}),
  }
], action) => {
  switch (action.type) {
    case 'ADD_MESSAGE':
    case 'DELETE_MESSAGE':
      const threadIndex = findThreadIndex(state, action);

      const oldThread = state[threadIndex];
      const newThread = {
        ...oldThread,
        messages: messagesReducer(oldThread.messages, action),
      };

      return [
        ...state.slice(0, threadIndex),
        newThread,
        ...state.slice(threadIndex + 1, state.length)
      ];
    default:
      return state;
  }
}

const messagesReducer = (state = [], action) => {
  switch (action.type) {
    case 'ADD_MESSAGE':
      const newMessage = {
        text: action.text,
        timestamp: Date.now(),
        id: uuid.v4(),
      }
      return state.concat(newMessage);
    case 'DELETE_MESSAGE':
      return state.filter(m => m.id !== action.id);
    default:
      return state;
  }
};

const reducer = combineReducers({
  activeThreadId: activeThreadIdReducer,
  threads: threadsReducer,
});

// store set up
const store = createStore(reducer);
console.log(store.getState());

// action creators set up
const deleteMessage = (id) => (
  {
    type: 'DELETE_MESSAGE',
    id,
  }
);

const addMessage = (text, threadId) => (
  {
    type: 'ADD_MESSAGE',
    text,
    threadId,
  }
);

const openThread = (id) => (
  {
    type: 'OPEN_THREAD',
    id,
  }
);

// Ending reducers, store & action creators set up

////// React start from here ////

// Main App with 2 container components
class App extends Component {
  render() {
    return (
        <div className='ui segment'>
          <ThreadTabs />
          <ThreadDisplay />
        </div>
    );
  }
};

// stateless component belong to container component 1
const Tabs = (props) => (
  <div className='ui top attached tabular menu'>
    {
      props.tabs.map((tab, index) => (
        <div
          key={index}
          className={tab.active ? 'active item' : 'item'}
          onClick={() => props.onClick(tab.id)}
        >
          {tab.title}
        </div>
      ))
    }
  </div>
);

const mapStateToTabsProps = (state) => {
  const tabs = state.threads.map(t => (
    {
      title: t.title,
      active: t.id === state.activeThreadId,
      id: t.id,
    }
  ));

  return { tabs };
};

const mapDispatchToTabProps = (dispatch) => (
  {
    // onClick: (id) => store.dispatch({
    //   type: 'OPEN_THREAD',
    //   id,
    // }),
    onClick: (id) => dispatch(openThread(id)),
  }
);

// use connect()
// connect(
//   mapStateToTabsProps(state),
//   mapDispatchToTabProps(dispatch)
// )(PresentationalComponent);

// 1st container component
const ThreadTabs = connect(
  mapStateToTabsProps,
  mapDispatchToTabProps,
)(Tabs);

// container component 1
// class ThreadTabs extends Component {
//   componentDidMount() {
//     store.subscribe(() => this.forceUpdate());
//   }
//
//   render() {
//     const state = store.getState();
//     const tabs = state.threads.map(t => (
//       {
//         title: t.title,
//         active: t.id === state.activeThreadId,
//         id: t.id,
//       })
//     );
//
//     return (
//       <Tabs
//         tabs={tabs}
//         onClick={(id) =>
//           store.dispatch({
//             type: 'OPEN_THREAD',
//             id,
//           })
//         }
//       />
//     );
//   }
// };

// stateful component belongs to final stateless component
// of container component 2
// can split up if needed
class TextFieldSubmit extends Component {
  state = {
    value: '',
  };

  onChange = (e) => {
    this.setState({
      value: e.target.value,
    });
  };

  handleSubmit = () => {
    this.props.onSubmit(this.state.value);
    this.setState({
      value: '',
    })
  }

  render() {
    return (
      <div className='ui input'>
        <input
          onChange={this.onChange}
          value={this.state.value}
          type='text'
        />
        <button
          onClick={this.handleSubmit}
          className='ui primary button'
          type='submit'
        >
          Submit
        </button>
      </div>
    );
  }
};

// stateless component belongs to final stateless component
// of container component 2
const MessageList = (props) => (
  <div className='ui comments'>
    {
      props.messages.map((m, index) => (
        <div
          className='comment'
          key={index}
          onClick={() => props.onClick(m.id)}
        >
          <div className='text'>
            {m.text}
            <span className='metadata'>@{m.timestamp}</span>
          </div>
        </div>
      ))
    }
  </div>
);

// final stateless component belongs to container component 2
const Thread = (props) => (
  <div className='ui center aligned basic segment'>
    <MessageList
      messages={props.thread.messages}
      onClick={props.onMessageClick}
    />
    <TextFieldSubmit
      onSubmit={props.onMessageSubmit}
    />
  </div>
);

// use connect()
const mapStateToThreadProps = (state) => (
  {
    thread: state.threads.find(
      t => t.id === state.activeThreadId
    ),
  }
);

const mapDispatchToThreadProps = (dispatch) => (
  {
    // onMessageClick: (id) => store.dispatch({
    //   type: 'DELETE_MESSAGE',
    //   id,
    // }),
    onMessageClick: (id) => dispatch(deleteMessage(id)),
    dispatch,
  }
);

const mergeThreadProps = (stateProps, dispatchProps) => (
  {
    ...stateProps,
    ...dispatchProps,
    onMessageSubmit: (text) => dispatchProps.dispatch(addMessage(text, stateProps.thread.id)),
    // onMessageSubmit: (text) => (
    //   dispatchProps.dispatch({
    //     type: 'ADD_MESSAGE',
    //     text,
    //     threadId: stateProps.thread.id,
    //   })
    // ),
  }
);

// 2nd container component
const ThreadDisplay = connect(
  mapStateToThreadProps,
  mapDispatchToThreadProps,
  mergeThreadProps
)(Thread);

// container component 2
// class ThreadDisplay extends Component {
//   componentDidMount() {
//     store.subscribe(() => this.forceUpdate());
//   };
//
//   render() {
//     const state = store.getState();
//     const activeThreadId = state.activeThreadId;
//     const activeThread = state.threads.find(
//       t => t.id === activeThreadId
//     );
//
//     return (
//       <Thread
//         thread={activeThread}
//         onMessageClick={(id) => store.dispatch({
//             type: 'DELETE_MESSAGE',
//             id,
//           })
//         }
//         onMessageSubmit={(text) => store.dispatch({
//             type: 'ADD_MESSAGE',
//             text: text,
//             threadId: activeThreadId,
//           })
//         }
//       />
//     );
//   }
// };

const WrappedApp = () => (
  <Provider store={store}>
    <App />
  </Provider>
);

export default WrappedApp;
