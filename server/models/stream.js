var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var streamSchema = new Schema({
    _id: {type: String, lowercase:true, unique:true},
    type: {type: String, uppercase:true, required:true, enum: ['ACESTREAM', 'SOPCAST', 'HTTP']},
    linkId: {type: String, required:true},
    link: {type: String, required:true},
    language: {type: String, default: 'None'},
    rating: {type: Number, min: 0, max: 5, default: 5},
    dateEntered: Date,
    dateModified: {type: Date, default: Date.now()}
});

var Stream = mongoose.model('Stream', streamSchema);
module.exports = Stream;