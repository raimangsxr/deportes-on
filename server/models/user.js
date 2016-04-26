var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    username: {type: String, required: true},
    password: {type: String, required: true},
    email: {type: String, required: true},
    name: {type: String, required: true},
    lastname: {type: String, required: true},
    dateEntered: Date,
    dateModified: {type: Date, default: new Date(Date.now())}
});

var User = mongoose.model('User', userSchema);
module.exports = User;