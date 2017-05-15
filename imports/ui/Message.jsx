import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import { Messages } from '../api/messages.js';
 
// Message component - represents a single todo item
export default class Message extends Component {
  toggleChecked() {
    Meteor.call('messages.setChecked', this.props.message._id, !this.props.message.checked);
  }

  togglePrivate() {
    Meteor.call('messages.setPrivate', this.props.message._id, ! this.props.message.private);
  }

  deleteThisMessage() {
    // Explicit call to the server
    Messages.remove(this.props.message._id);
  }

  render() {
    const messageClassName = classnames({
      checked: this.props.message.checked,
      private: this.props.message.private,
    });

    return (
      <li className={messageClassName}>
        <button 
          className="delete"
          onClick={this.deleteThisMessage.bind(this)}>
          &times;
        </button>

        <input 
          type="checkbox"
          readOnly
          checked={this.props.message.checked}
          onClick={this.toggleChecked.bind(this)}
        />

        { this.props.showPrivateButton ? (
          <button className="toggle-private" onClick={this.togglePrivate.bind(this)}>
            { this.props.message.private ? 'Private' : 'Public' }
          </button>
        ) : ''}

         <span className="text">
          <strong>{this.props.message.username}</strong>: {this.props.message.text}
        </span>
      </li>
    );
  }
}
 
Message.propTypes = {
  message: PropTypes.object.isRequired,
  showPrivateButton: PropTypes.bool.isRequired,
};