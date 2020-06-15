import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Qualifications = new Mongo.Collection('Qualification');


if (Meteor.isServer) {
    Meteor.publish('qualifications', () => Qualifications.find({
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

    'qualification.updateAnotherQualification'(taskId, setRestaurantComment, setRestauranScore) {
        check(taskId, String);
        check(setRestaurantComment, String);
        check(setRestauranScore, String);

        console.log('------>', taskId, '----->', setRestaurantComment, '------->', setRestauranScore)
        const qualification = Qualification.findOne(taskId);
        if (!qualification) {
            Qualification.insert({
                taskId,
                setRestaurantComment,
                setRestauranScore,
                createAt: new Date(),
                owner: Meteor.userId(),
                username: Meteor.user().username,
            });
        } else {
            Qualification.update(
                taskId,
                {
                    $set: {
                        restaurantComment: setRestaurantComment,
                        restauranScore: setRestauranScore
                    }
                });
        }
    }
})