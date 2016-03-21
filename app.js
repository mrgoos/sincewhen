//  OpenShift sample Node application

var fs = require('fs');
var mongodb = require('mongodb');
var express = require('express');
//var ejs = require('ejs');
var http = require('http');
var bodyParser = require('body-parser');
var env = process.env;

var app = express();
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-

app.use(express.static(__dirname + '/public'));
//app.set('view engine', 'ejs');
app.get('/getads', function(req, res) {
    var realIDs = req.query.realIDs && req.query.realIDs.split(',');
    if (realIDs && realIDs.length) {
        //avid too large array
        if (realIDs.length < 60) {
            var cursor = yad2Collection.find({ realID: { $in: realIDs } }, { _id: 0 }).sort({ realID: 1, timestamp: -1 });
            cursor.toArray(function(err, ids) {
                if (err) {
                    console.log('error: Could not fulfill request: ' + err);
                    res.status(500).send({ error: 'Could not fulfill request: ' + err });
                } else {
                    res.status(200).send(ids);
                    //console.log('ids:', ids);
                }
            });
        } else {
            //array length is too large
            res.status(500).send({ error: 'Nice try! :)' });
            console.log('array length is way too large:', realIDs.length);
        }
    } else {
        //realIDs wasn't sent
        res.status(500).send({ error: 'Nice try! :)' });
        console.log('No IDs were sent. Got: ', realIDs);
    }
});

app.post('/insertads', function(req, res) {
    if (Array.isArray(req.body)) {
          yad2Collection.insert(req.body, function(e, results){
            if (e) {
                res.status(500).send({ error: 'What are you trying to insert???' });
            }
            res.end(results && results.insertedCount && results.insertedCount.toString());
            //console.log(results);
          })
    } else {
        //no array set
        res.status(500).send({ error: 'Nice try! :)' });
        console.log('No array sent to post. Got: ', req.body);
    }

})

var serverIp = env.NODE_IP || 'localhost';
var serverPort = env.NODE_PORT || 3000;
var dbUri = process.env.MONGOLAB_URI || 'mongodb://localhost:27017/sincewhen';
var db;
var server;
var yad2Collection;
mongodb.MongoClient.connect(dbUri, { server: { auto_reconnect: true } }, function(err, database) {
    if (err) {
        console.log('err: ', err);
    }
    else {
        db = database;
        yad2Collection = db.collection('yad2');
        console.log('connected to DB!');
    }
});

app.listen(serverPort, serverIp, function() {
    console.log(`App started, listening to port ${serverPort}`);
});