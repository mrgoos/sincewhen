//  OpenShift sample Node application

var fs = require('fs');
var mongodb = require('mongodb');
var express = require('express');
//var ejs = require('ejs');
var http = require('http');
var env = process.env;

var app = express();

app.use(express.static(__dirname + '/public'));
//app.set('view engine', 'ejs');
app.get('/getads', function(req, res) {
    var realIDs = req.query.realIDs && req.query.realIDs.split(',');
    if (realIDs && realIDs.length) {
        //avid too large array
        if (realIDs.length < 60) {
            var cursor = db.collection('yad2').find({ realID: { $in: realIDs } }, { _id: 0 }).sort({ realID: 1, timestamp: -1 });
            cursor.toArray(function(err, ids) {
                if (err) {
                    console.log('error: Could not fulfill request: ' + err);
                    res.status(500).send({ error: 'Could not fulfill request: ' + err });
                } else {
                    res.status(200).send(ids);
                    console.log('ids:', ids);
                }
            });
        } else {
            //array length is too large
            res.send(500, { error: 'Nice try! :)' });
            console.log('array length is way too large:', realIDs.length);
        }
    } else {
        //realIDs wasn't sent
        res.send(500, { error: 'Nice try! :)' });
        console.log('No IDs were sent');
    }
});

var serverIp = env.NODE_IP || 'localhost';
var serverPort = env.NODE_PORT || 3000;
var dbUri = process.env.MONGOLAB_URI || 'mongodb://localhost:27017/sincewhen';
var db;
var server;
mongodb.MongoClient.connect(dbUri, { server: { auto_reconnect: true } }, function(err, database) {
    if (err) {
        console.log('err: ', err);
    }
    else {
        db = database;
        console.log('connected to DB!');
    }
});

app.listen(serverPort, serverIp, function() {
    console.log(`App started, listening to port ${serverPort}`);
});