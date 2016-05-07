var express = require('express');
var router = express.Router();
var Event = require('../models/event.js');


/* GET Event listing. */
router.get('/', function(req, res) {
    var firstDate = new Date();
    firstDate.setHours(firstDate.getHours() -2);
    //console.log(new Date().toISOString()+' - Fecha de inicio de eventos: '+firstDate);
    Event.find({date:{$gte:firstDate}}, function(err, events){
        if(!err){
            console.log(new Date().toISOString()+' - API: Listing all events success');
            return res.status(200).send(events);
        }
        else{
            console.log(new Date().toISOString()+' - API: Listing all events failed. Caused by: '+err.message);
            return res.status(500).send(err);
        }
    });
});


/* POST new event. */
router.post('/', function(req, res){
    var event = new Event({
        title: req.body.title,
        category: req.body.category,
        date: req.body.date,
        streams: req.body.streams,
        userPosts: req.body.userPosts,
        dateEntered: new Date(Date.now()),
        dateModified: new Date(Date.now())
    });

    event.save(function(err){
        if(!err){
            console.log(new Date().toISOString()+' - API: Created event success: "'+event.title+'"');
            return res.status(200).send(event);
        }
        else{
            if(err.code === 11000) { //duplicate key error (title is unique)
                console.log(new Date().toISOString()+' - API: Event already added: "'+event.title+'". Nothing to do');
                return res.status(202).send(event);
            }
            console.log(new Date().toISOString()+' - API: Create event failed: "'+event.title+'". Caused by: '+err.message);
            return res.status(500).send(err);
        }
    });
});


/* PUT (modify) existing event. */
router.put('/', function(req, res){
    var id = req.body._id;
    Event.update({
        _id: id
    },{
        $set: {
            category: req.body.category,
            date: req.body.date,
            streams: req.body.streams,
            userPosts: req.body.userPosts,
            dateModified: new Date(Date.now())
        }
    }, function(err){
        if(!err){
            console.log(new Date().toISOString()+' - API: Updated event success: "'+req.body._id+'"');
            return res.status(200).send('Event Updated');
        }
        else{
            console.log(new Date().toISOString()+' - API: Updated event failed: "'+req.body.title+'". Caused by: '+err.message);
            return res.status(500).send(err);
        }
    });
});


/* GET event info. */
router.get('/:id', function(req, res) {
    var id = req.params.id;
    Event.findOne({_id: id}, function(err, event){
        if(!err){
            console.log(new Date().toISOString()+' - API: Get event info success: '+event.title);
            return res.status(200).send(event);
        }
        else{
            console.log(new Date().toISOString()+' - API: Get event info failed (id:'+id+'). Caused by: '+err.message);
            return res.status(500).send(err);
        }
    });
});


module.exports = router;
