import { Meteor } from 'meteor/meteor';
import { Factory } from 'meteor/dburles:factory';
import React from 'react';
import { Random } from 'meteor/random';
import { shallow } from 'enzyme';
import App from './App.jsx';
import { _ } from 'meteor/underscore';

import '../api/messages.js';

if (Meteor.isClient) {
    describe('App', () => {
        it('should render messages ordered by date', () => {
            const userId = Random.id();;
            const username = 'kyle';
            const datesUnordered = [
                new Date('2016/01/01'), 
                new Date('2015/01/01'), 
                new Date('2017/01/01')
            ];
            const datesOrdered = datesUnordered.sort((a, b) => {
                return b - a;
            });
            _.times(3, (idx) => {
                Factory.create('message', { 
                    text: idx,
                    owner: userId, 
                    username,
                    createdAt: datesUnordered[idx],
                });
            });
            
            const item = shallow(<App />);
            _.forEach(item.node.props.messages, (message, idx) => {
                expect(message.createdAt).toEqual(datesOrdered[idx]);
            });
        });
    });
}