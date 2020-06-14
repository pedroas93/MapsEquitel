import { Mongo } from 'meteor/mongo';

// export const Tasks = Mongo.Collection('tasks');
export const Tasks = new Mongo.Collection('tasks');
