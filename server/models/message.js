var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var messageSchema = new Schema({
    name: {type: String, required: true},
    email: {type: String, required:true},
    message: {type: String, required:true},
    dateEntered: {type: Date}
});

var Message = mongoose.model('Message', messageSchema);
module.exports = Message;