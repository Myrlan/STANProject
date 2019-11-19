var mongo = require('mongodb')
var MongoClient = require('mongodb').MongoClient;

var url = "mongodb://localhost:27017/newdb";

MongoClient.connect(url,
    function(err, db) {
    if (err) throw err;
    console.log("Database connected!");
    var dbo = db.db("newdb");
    // Insertion (one et many avec un array json)
    // dbo.collection("students").insertOne({"name":"Abhishek","marks":100}, function(err, res) {
    //     if (err) throw err;
    //     console.log("1 document inserted");
    //     db.close();
    // });
    // dbo.collection("students").insertMany([{"name":"John","marks":90},{"name":"Tim","marks":80}], function(err, res) {
    //     if (err) throw err;
    //     console.log("1 document inserted");
    //     db.close();
    // });
    
});