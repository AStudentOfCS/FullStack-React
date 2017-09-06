import React, { Component } from 'react';

export default class MessageView extends Component {
  handleClick = (index) => {
    store.dispatch({
      type: 'DELETE_MESSAGE',
      index: index,
    });
  };

  render() {
    const messages = this.props.messages.map((message) => {
      <div
        className='comment'
        key={index}
        onClick={() => this.handleClick(index)}
      >
        {message}
      </div>
    });

    return (
      <div>
        {messages}
      </div>
    )
  }
}
