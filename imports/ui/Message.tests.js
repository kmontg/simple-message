import { Meteor } from 'meteor/meteor';
import { Factory } from 'meteor/dburles:factory';
import React from 'react';
import { shallow } from 'enzyme';
import Message from './Message.jsx';

import '../api/messages.js';

if (Meteor.isClient) {
    describe('Message', () => {
        it('should render', () => {
            const text = 'testing';
            const message = Factory.create('message', { text, });
            const item = shallow(<Message message={message} />);
            expect(item.find('span').text()).toContain(text);
        });
    });
}