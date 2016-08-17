var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var eventSchema = new Schema({
    title: {type: String, required: true},
    competition: String,
    category: {type: String, required:true},
    date: {type: Date, required: true},
    streams: [],
    userPosts:[],
    dateEntered: Date,
    dateModified: {type: Date, default: Date.now()},
});

eventSchema.index({ title: 1, date: 1}, { unique: true });

var Event = mongoose.model('Event', eventSchema);
module.exports = Event;