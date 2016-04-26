var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Stream = require('./stream.js');
var UserPost = require('./userPost.js');

var eventSchema = new Schema({
    title: {type: String, required: true, unique: true},
    category: {type: String, required:true},
    date: {type: Date, required: true},
    streams: [],
    userPosts:[],
    dateEntered: Date,
    dateModified: {type: Date, default: Date.now()},
});

var Event = mongoose.model('Event', eventSchema);
module.exports = Event;