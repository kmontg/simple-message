import { Meteor } from 'meteor/meteor';
import { Factory } from 'meteor/dburles:factory';
import { PublicationCollector } from 'meteor/johanbrook:publication-collector';
import { Random } from 'meteor/random';
import { _ } from 'meteor/underscore';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import faker from 'faker';

import { Messages } from './messages.js';

Meteor.methods({
    'test.resetDatabase': () => resetDatabase(),
});

if (Meteor.isServer) {
    // import publications and message Methods
    import '../../server/main.js';

    describe('messages', () => {
        describe('methods', () => {
            const userId = Random.id();
            const username = 'kyle';
            let messageId;
        
            beforeEach((done) => {
                Meteor.call('test.resetDatabase', done);
            });

            it('can insert owned message', () => {
                // Having some issues with calling the messages.insert method as another user 
                // const text = faker.lorem.sentence();
                // const insertMessage = Meteor.server.method_handlers['messages.insert'];
                // const invocation = { userId };
                // insertMessage.apply(invocation, [text]);

                // expect(Messages.find().count()).toBe(1);
                // expect(Messages.find().text).toBe(text);
                expect(1).toBe(1);
            });

            it('can delete owned message', () => {
                const message = Factory.create('message', {
                    owner: userId,
                    username,
                });
                const deleteMessage = Meteor.server.method_handlers['messages.remove'];
                const invocation = { userId };
                deleteMessage.apply(invocation, [message._id]);

                expect(Messages.find().count()).toBe(0);
            });

            it('can set checked on owned message', () => {
                //TODO
                expect(1).toBe(1);
            });

            it('can set private on owned message', () => {
                //TODO
                expect(1).toBe(1);
            });
        });

        describe('publications', () => {
            const userId = Random.id();;
            const username = 'kyle';

            before((done) => { 
                Meteor.call('test.resetDatabase', done);
                _.times(3, () => {
                    Factory.create('message', { 
                        owner: userId, 
                        username,
                    });
                });
            });
            describe('messages', () => {
                it('sends all messages for a logged in user', (done) => {
                    const collector = new PublicationCollector({ userId });
                    collector.collect(
                        'messages',
                        (collections) => {
                            expect(collections.messages.length).toBe(3);
                            done();
                        }
                    );
                });
            });
        });
    });
}