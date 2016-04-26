var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userPostSchema = new Schema({
    _id: Schema.ObjectId,
    username: {type: String, required:true},
    ip: {type: String, required:true},
    language: {type: String, default: 'None'},
    rating: {type: Number, min: 0, max: 5, default: 5},
    dateEntered: {type: Date, default: Date.now()}
});

var UserPost = mongoose.model('UserPost', userPostSchema);
module.exports = UserPost;