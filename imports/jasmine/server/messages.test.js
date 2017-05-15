import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';

import { Messages } from '../../api/messages.js';

if (Meteor.isServer) {
    describe('Messages', () => {
        describe('methods', () => {
            const userId = Random.id();
            let messageId;
        
            beforeEach(() => {
                Messages.remove({});
                messageId = Messages.insert({
                    text: 'test message',
                    createdAt: new Date(),
                    owner: userId,
                    username: 'kmontg03',
                });
            });

            it('can delete owned task', () => {
                const deleteTask = Meteor.server.method_handlers['messages.remove'];

                const invocation = { userId };

                deleteTask.apply(invocation, [messageId]);

                expect(Messages.find().count()).toBe(0);
            });
        });
    });
}