const app = require('express')();
const bodyParser = require('body-parser');
app.use(bodyParser.json());
// might want to use this to avoid having to scope db-related function calls inside the connect callback
// const EventEmitter = require('events');
// const eventEmitter = new EventEmitter();
//eventEmitter.emit('characters');
// eventEmitter.on('characters', function() {
//     console.log("OMG someone is hitting the /characters endpoint! OMG OMG OMG");
// });

var MongoClient = require('mongodb').MongoClient;
MongoClient.connect("mongodb://localhost:27017/", function(mongoerr, db) {
    const dbo = db.db("practicedb");

    app.get('/characters', function(req, res) {
        dbo.collection("people").find({}).toArray(function(endpointerr, result) {
            res.send(result);
        });
    });

    app.post('/characters', function(req, res) {
        dbo.collection("people").insertMany(req.body, function(err, result) {
            res.send(result);
        });
    });

    app.put('/characters', function(req, res) {
        const character = req.body;

        dbo.collection("people").update({name: character.name}, character, function(err, result) {
            res.send(result);
        });
    });
});

app.listen(3000, function() {
    console.log("Server is listening...");
});