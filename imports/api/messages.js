import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Mongo } from 'meteor/mongo';
import { Factory } from 'meteor/dburles:factory';
import faker from 'faker';

export const Messages = new Mongo.Collection('messages');

if (Meteor.isServer) {
    Meteor.publish('messages', function messagesPublication() {
        return Messages.find({
        $or: [
            { private: { $ne: true } },
            { owner: this.userId },
        ],
        });
    });
}

Meteor.methods({
  'messages.insert'(text) {
    check(text, String);
 
    // Make sure the user is logged in before inserting a message
    if (! Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }
 
    Messages.insert({
      text,
      createdAt: new Date(),
      owner: Meteor.userId(),
      username: Meteor.user().username,
    });
  },
  'messages.remove'(messageId) {
    check(messageId, String);

    const message = Messages.findOne(messageId);
    if (message.private && message.owner !== Meteor.userId()) {
      // If the message is private, make sure only the owner can delete it
      throw new Meteor.Error('not-authorized');
    }
 
    Messages.remove(messageId);
  },
  'messages.setChecked'(messageId, setChecked) {
    check(messageId, String);
    check(setChecked, Boolean);

    const message = Messages.findOne(messageId);
    if (message.private && message.owner !== Meteor.userId()) {
      // If the message is private, make sure only the owner can check it off
      throw new Meteor.Error('not-authorized');
    }
 
    Messages.update(messageId, { $set: { checked: setChecked } });
  },
  'messages.setPrivate'(messageId, setToPrivate) {
    check(messageId, String);
    check(setToPrivate, Boolean);
 
    const message = Messages.findOne(messageId);
 
    // Make sure only the message owner can make a message private
    if (message.owner !== Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }
 
    Messages.update(messageId, { $set: { private: setToPrivate } });
  },
});

Factory.define('message', Messages, {
  text: () => faker.lorem.sentence(),
  createdAt: () => new Date(),
});