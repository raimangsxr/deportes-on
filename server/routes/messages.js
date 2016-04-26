var express = require('express');
var router = express.Router();
var Message = require('../models/message.js');

/* POST new stream. */
router.post('/', function(req, res){
    var newMessage = new Message({
        name: req.body.name,
        email: req.body.email,
        message: req.body.text,
        dateEntered: new Date(Date.now())
    });
    newMessage.save(function(err){
        if(!err){
            console.log('API: Created message success');
            return res.status(200).send(newMessage);
        }
        else{
            console.log('API: Created message failed. Caused by: '+err.message);
            return res.status(500).send(err);
        }
    });
});

module.exports = router;
