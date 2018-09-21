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

    // increments and then fetches next ID value for appropriate collection; used when inserting new documents as a way of simulating ID auto incrementation
    // auto incrementing is probably a bad idea
    function getNextSequenceValue(sequenceName, httpResponse) {
        dbo.collection("counters").findOneAndUpdate({_id: sequenceName}, {$inc: {value: 1}}, {returnNewDocument: true}, function(err, result) {
            httpResponse.send(result.value);
        });
    }

    app.get('/characters', function(req, res) {
        dbo.collection("people").find({}).toArray(function(endpointerr, result) { //apparently toArray can only be called for fetch operations
            res.send(result);
        });
    });

    app.post('/insert-character', function(req, res) {
        dbo.collection("people").insertOne(req.body, function(err, result) {
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

    app.get('/residences', function(req, res) {
        dbo.collection("residences").aggregate([
            {
                $lookup: {
                    from: "people",
                    localField: "_id",
                    foreignField: "residence_id",
                    as: "people"
                }
            }
        ]).toArray(function(err, result) {
            res.send(result);
        });
    });

    app.post('/residences', function(req, res) {
        dbo.collection("residences").insertMany(req.body, function(err, result) {
            res.send(result);
        });
    });

    app.get('/test', function(req, res) {
        dbo.collection("people").find({race: "Human"}, {projection: {_id: 0, residence_id: 0}}).toArray(function(req, result) {
            res.send(result);
        });
    });

    app.get('/test2', function(req, res) {
        // return name-id pairs for residences
        dbo.collection("residences").find({}, {projection: {_id: 1, name: 1}}).toArray(function(err, result) {
            const response = [];
            result.forEach(function(item) {
                var tempObj = {};
                tempObj[item.name] = item._id;
                response.push(tempObj);
            });
            res.send(response);
        });
    });
});

app.listen(3000, function() {
    console.log("Server is listening...");
});