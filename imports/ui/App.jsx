import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';

import { Messages } from '../api/messages.js';
 
import Message from './Message.jsx';
import AccountsUIWrapper from './AccountsUIWrapper.jsx';
 
// App component - represents the whole app
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hideCompleted: false,
    };
  }

  handleSubmit(event) {
    event.preventDefault();
 
    // Find the text field via the React ref
    const text = ReactDOM.findDOMNode(this.refs.textInput).value.trim();
 
    // Client-side call to insert message
    Meteor.call('messages.insert', text);
 
    // Clear form
    ReactDOM.findDOMNode(this.refs.textInput).value = '';
  }

  toggleHideCompleted() {
    this.setState({
      hideCompleted: !this.state.hideCompleted,
    });
  }

  renderMessages() {
    let filteredMessages = this.props.messages;
    if (this.state.hideCompleted) {
      filteredMessages = filteredMessages.filter(message => !message.checked);
    }
    return filteredMessages.map((message) => {
      const currentUserId = this.props.currentUser && this.props.currentUser._id;
      const showPrivateButton = message.owner === currentUserId;
 
      return (
        <Message
          key={message._id}
          message={message}
          showPrivateButton={showPrivateButton}
        />
      );
    });
  }
 
  render() {
    return (
      <div className="container">
        <header>
          <h1>Message List ({this.props.incompleteCount})</h1>

          <label className="hide-completed">
            <input 
              type="checkbox"
              readOnly
              checked={this.state.hideCompleted}
              onClick={this.toggleHideCompleted.bind(this)}
            />
            Hide Completed Messages
          </label>

          <AccountsUIWrapper />

          { this.props.currentUser ?
            <form className="new-message" onSubmit={this.handleSubmit.bind(this)}>
              <input 
                type="text"
                ref="textInput"
                placeholder="Type to add new messages"
              />
            </form> : ''
          }
          
        </header>
        <ul>
          {this.renderMessages()}
        </ul>
      </div>
    );
  }
}

App.propTypes = {
  messages: PropTypes.array.isRequired,
  incompleteCount: PropTypes.number.isRequired,
  currentUser: PropTypes.object,
};

export default createContainer(() => {
  Meteor.subscribe('messages');

  return {
    messages: Messages.find({}, { sort: { createdAt: -1 } }).fetch(),
    incompleteCount: Messages.find({ checked: { $ne: true } }).count(),
    currentUser: Meteor.user(),
  };
}, App);