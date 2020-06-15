import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
// export const Tasks = Mongo.Collection('tasks');
export const Tasks = new Mongo.Collection('tasks');


if (Meteor.isServer) {
    Meteor.publish('tasks', () => Tasks.find({
        $or: [
            {
                private: { $ne: true },
            },
            {
                owner: Meteor.userId(),
            },
        ]
    }));
}

Meteor.methods({
    'tasks.insert'(restauranName, restaurantLat, restaurantLng, restaurantType, restaurantComment, restauranScore) {
        check(restauranName, String);
        check(restaurantLat, String);
        check(restaurantLng, String);
        check(restaurantType, String);
        check(restaurantComment, String);
        check(restauranScore, String);

        if (!this.userId) {
            throw new Meteor.Error('no-autorized');
        }
        Tasks.insert({
            restauranName,
            restaurantLat,
            restaurantLng,
            restaurantType,
            restaurantComment,
            restauranScore,
            createAt: new Date(),
            owner: Meteor.userId(),
            username: Meteor.user().username,
        });

    },

    'tasks.updateOwnCommentScore'(taskId, setRestaurantComment, setRestauranScore) {
        check(taskId, String);
        check(setRestaurantComment, String);
        check(setRestauranScore, String);

        console.log('------>', taskId, '----->', setRestaurantComment, '------->', setRestauranScore)
        const task = Tasks.findOne(taskId);
        if (task.owner !== this.userId) {
            throw new Meteor.Error('not-Autorized');
        }
        Tasks.update(taskId, { $set: { restaurantComment: setRestaurantComment, restauranScore: setRestauranScore } });
    },

    'tasks.remove'(taskId) {
        check(taskId, String);
        const task = Tasks.findOne(taskId);
        if (task.owner !== this.userId) {
            throw new Meteor.Error('not-Autorized');
        }
        Tasks.remove(taskId);
    },


    'tasks.setChecked'(taskId, setChecked) {
        check(taskId, String);
        check(setChecked, Boolean);

        const task = Tasks.findOne(taskId);

        if (task.owner !== this.userId) {
            throw new Meteor.Error('not-Autorized');
        }

        Tasks.update(taskId, { $set: { checked: setChecked } });
    },

    'tasks.setPrivate'(taskId, setToPrivate) {
        check(taskId, String);
        check(setToPrivate, Boolean);

        const task = Tasks.findOne(taskId);

        if (task.owner !== this.userId) {
            throw new Meteor.Error('no-autorized');
        }

        Tasks.update(taskId, { $set: { private: setToPrivate } });
    }
})