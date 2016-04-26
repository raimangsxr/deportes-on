var express = require('express');
var router = express.Router();
var User = require('../models/user.js');

/* GET users listing. */
router.get('/', function(req, res) {
  User.find({}, function(err, users){
    if(!err){
      console.log('Listing all users success');
      return res.status(200).send(users);
    }
    else{
      console.log('Listing all users failed. Caused by: '+err.message);
      return res.status(500).send(err);
    }
  });
});


/* POST new user. */
router.post('/', function(req, res){
  var user = new User({
    username: req.body.username,
    password: req.body.password,
    email: req.body.email,
    name: req.body.name,
    lastname: req.body.lastname,
    dateEntered: new Date(Date.now()),
    dateModified: new Date(Date.now())
  });

  user.save(function(err){
    if(!err){
      console.log('Created user success: "'+user.username+'"');
      return res.status(200).send(user);
    }
    else{
      console.log('Created user failed: "'+user.username+'". Caused by: '+err.message);
      return res.status(500).send(err);
    }
  });
});


/* PUT (modify) existing user. */
router.put('/', function(req, res){
  var id = req.body._id;
  User.update({
    _id: id
  },{
    $set: {
      password: req.body.password,
      email: req.body.email,
      name: req.body.name,
      lastname: req.body.lastname,
      dateModified: new Date(Date.now())
    }
  }, function(err){
    if(!err){
      console.log('Updated user success: "'+req.body.username+'"');
      return res.status(200).send('User Updated');
    }
    else{
      console.log('Updated user failed: "'+req.body.username+'". Caused by: '+err.message);
      return res.status(500).send(err);
    }
  });
});


/* GET user info. */
router.get('/:id', function(req, res) {
  var id = req.params.id;
  User.findOne({_id: id}, function(err, user){
    if(!err){
      console.log('Get user info success: '+user.username);
      return res.status(200).send(user);
    }
    else{
      console.log('Get user info failed (id:'+id+'). Caused by: '+err.message);
      return res.status(500).send(err);
    }
  });
});


module.exports = router;
