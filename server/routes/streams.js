var express = require('express');
var router = express.Router();
var Stream = require('../models/stream.js');

/* GET Streams listing. */
router.get('/', function(req, res) {
    Stream.find({}, function(err, streams){
        if(!err){
            console.log('API: Listing all streams success');
            var jsonStreams = {};
            streams.forEach(function(stream){
                jsonStreams[stream._id] = stream;
            });
            return res.status(200).send(jsonStreams);
        }
        else{
            console.log('API: Listing all streams failed. Caused by: '+err.message);
            return res.status(500).send(err);
        }
    });
});


/* POST new stream. */
router.post('/', function(req, res){
    var newStream = new Stream({
        _id: req.body._id,
        type: req.body.type,
        linkId: req.body.linkId,
        link: req.body.link,
        language: req.body.language,
        rating: req.body.rating,
        dateEntered: new Date(Date.now()),
        dateModified: new Date(Date.now())
    });
    newStream.save(function(err){
        if(!err){
            console.log('API: Created stream success: "'+newStream._id+'"');
            return res.status(200).send(newStream);
        }
        else{
            console.log('API: Created stream failed: "'+newStream._id+'". Caused by: '+err.message);
            return res.status(500).send(err);
        }
    });
});


/* PUT (modify) existing stream. */
router.put('/', function(req, res){
    var id = req.body._id;
    Stream.update({
        _id: id
    }, {
        $set: {
            type: req.body.type,
            linkId: req.body.linkId,
            link: req.body.link,
            language: req.body.language,
            rating: req.body.rating,
            dateModified: new Date(Date.now())
        }
    }, function (err) {
        if (!err) {
            console.log('API: Updated stream success: "' + req.body._id + '"');
            return res.status(200).send('Stream Updated');
        }
        else {
            console.log('API: Updated stream failed: "' + req.body._id + '". Caused by: ' + err.message);
            return res.status(500).send(err);
        }
    });
});


/* GET stream info. */
router.get('/:id', function(req, res) {
    var id = req.params.id.toLowerCase();
    Stream.findOne({_id: id}, function(err, stream){
        if(!err){
            console.log('API: Get stream info success: '+id);
            if(!stream) stream = {};
            return res.status(200).send(stream);
        }
        else{
            console.log('API: Get stream info failed (id:'+id+'). Caused by: '+err.message);
            return res.status(500).send(err);
        }
    });
});


module.exports = router;
