var express = require('express');
var router = express.Router();
var mongo = require('mongodb').MongoClient;
var objectId = require('mongodb').ObjectID;
var assert = require('assert');

var url = 'mongodb+srv://comp20-final:kJovZNam4Qo2zCP7@cluster0-4ndfb.mongodb.net/test?retryWrites=true&w=majority';

router.post('/insert', function(req, res, next) {
  var item = {
    Username: req.body.username,
    // content: req.body.content,
    // author: req.body.author
  };

  mongo.connect(url, function(err, db) {
    assert.equal(null, err);
    var dbo = db.db("SavedRecipe");
    dbo.collection('collection').insertOne(item, function(err, result) {
      assert.equal(null, err);
      console.log('Item inserted');
      db.close();
    });
  });

  res.redirect('/');
});

module.exports = router;