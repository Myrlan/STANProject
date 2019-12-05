const express = require('express')
const session = require('express-session')
const game_routes_ref = require('./routes/game_routes.js')
const bodyParser = require('body-parser') // pour parser les requêtes POST

// Connexion à MongoDB :
var mongo = require('mongodb')
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/gameDB";
// Ou avec Mongoose : (ne marche pas)
// const mongoose = require('mongoose')
// mongoose.connect('mongodb://localhost/mydb')

MongoClient.connect(url,
  function(err, db) {
  if (err) throw err;
  console.log("Database connected!");
  var dbo = db.db("gameDB");
  // Insertion (one et many avec un array json)

  // dbo.collection("players").insertOne({"name":"Tristan","password":"apzoeiruty"}, function(err, res) {
  //     if (err) throw err;
  //     console.log("1 document inserted");
  //     db.close();
  // });
  // dbo.collection("players").insertMany([{"name":"John","password":"90"},{"name":"Tim","password":"80"}], function(err, res) {
  //     if (err) throw err;
  //     console.log("1 document inserted");
  //     db.close();
  // });

  // Remove a record : (supprime tous les doublons = toutes les occurences trouvées)
  // dbo.collection("players").remove({name:"Tristan"});
  // dbo.collection("players").remove({name:"John"});
  // dbo.collection("players").remove({name:"Tim"});

  // Filter results : (pour tout afficher, mettre find({}))
  var results = dbo.collection("players").find({name:"Tristan"});
  results.forEach(row => {
      console.log(row);
  });
});

const app = express()
app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({ extended: false })) // for simple form posts
app.use(bodyParser.json()) // for API requests

/* Utilisation d'un secret
sess = {
  secret: 'mydirtylittlesecret',
  name: 'sessId'
}
app.use(session(sess))*/

app.get('/', (req, res) => {
  res.send('ok');
  /*req.session = sess
  console.log(req.session)*/
})

app.use('/', game_routes_ref)

app.listen(3000, function () {
  console.log('Application démarrée sur le port 3000!')
  var opn = require('opn')
  opn('http://localhost:3000/start')
})
