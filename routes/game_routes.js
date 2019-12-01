const express = require('express')
// Connexion à MongoDB :
var mongo = require('mongodb')
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/gameDB";
//const mongoose = require('mongoose')
//mongoose.connect('mongodb://localhost/mydb')

// chargement du modèle User
const User = require("../models/user.model.js")

var path = require('path');
const router = express.Router()
const session = require('cookie-session')

// Variables :

sess = {
  name: 'session',
  keys: ['username','password']
}
router.use(session(sess))

// Routes :

router.get('/debug', (req, res) => {
  console.log("===DEBUG===")
  console.log(req.session)
  res.send("Cookie : " + req.session.keys)
})

router.get('/start', (req, res) => {
  res.sendFile(path.join(__dirname + '/main_menu.html'));
})

router.post('/register', (req, res) => {
  console.log("truc machin register")
  const { username, password } = req.body
  MongoClient.connect(url,
    function(err, db) {
    if (err) throw err;
    console.log("Database connected!");
    var dbo = db.db("gameDB");

    dbo.collection("players").find({name:username}).toArray(function(err, result){
      if (err) throw err;
      // Test d'existence :
      if(result.length==0){
        // Création du compte
        console.log("Création du compte avec l'ID " + username)
        dbo.collection("players").insertOne({"name":username,"password":password}, function(err, res) {
          if (err) throw err;
          console.log("1 document inserted");
          db.close();
        });
        var results = dbo.collection("players").find({name:username});
        results.forEach(row => {
            console.log(row);
        });
        // Connexion
        req.session.keys = [username,password]
        res.sendFile(path.join(__dirname + '/connecte.html'))
      }else{
        // Le compte existe déjà
        console.log("Il y a déjà un utilisateur avec ce pseudo !")
        res.sendFile(path.join(__dirname + '/Mal_inscrit.html'))
      }
      db.close();
    })
  });
})

router.post('/login', (req, res) => {
  console.log("login called")
  const { username, password } = req.body
  //console.log(req.session)
  // Test d'existence :
  MongoClient.connect(url,
    function(err, db) {
    if (err) throw err;
    console.log("Database connected!");
    var dbo = db.db("gameDB");

      dbo.collection("players").find({name:username}).toArray(function(err, result){
        if (err) throw err;
        // Test d'existence :
        if(result.length==0){
          // Erreur username
          console.log("Erreur : l'utilisateur '" + username + "' n'existe pas !")
          res.sendFile(path.join(__dirname + '/Mal_connecte.html'))
        }else{
          // Le pseudo existe : vérification du mot de passe
          if(result[0].password==password){
            console.log("Mot de passe correct, connexion réussie !")
            res.sendFile(path.join(__dirname + '/connecte.html'))
            req.session.keys = [username,password]
            //req.session.keys[1] = password
          }else{
            console.log("Mot de passe incorrect")
            res.sendFile(path.join(__dirname + '/Mal_connecte.html'))
          }
        }
        db.close();
      })
  });
})

module.exports = router
