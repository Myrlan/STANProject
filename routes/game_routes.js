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
  
    dbo.collection("players").insertOne({"name":username,"password":password}, function(err, res) {
        if (err) throw err;
        console.log("1 document inserted");
        db.close();
    });

    var results = dbo.collection("players").find({name:username});
    results.forEach(row => {
        console.log(row);
    });
  });
  res.sendFile(path.join(__dirname + '/connecte.html'))
})

router.post('/login', (req, res) => {
  console.log("login called")
  const { username, password } = req.body
  console.log(req.session)
  // Test d'existence :
  MongoClient.connect(url,
    function(err, db) {
    if (err) throw err;
    console.log("Database connected!");
    var dbo = db.db("gameDB");

    var results = dbo.collection("players").find({name:username});
    try{  // ne marche pas, avec function err,result non plus :'(
      results.forEach(row => {
        console.log(row.name);
        //if(username === row.name){
          res.sendFile(path.join(__dirname + '/connecte.html'))
          //res.send(req.body.username + " existe")
      });
    } 
    catch(err){ 
      // res.sendFile(path.join(__dirname + '/Mal_connecte.html'))
      // res.send("Echec")
      console.log("Echec log")
      // res.send(req.body.username + " n'existe pas")
    }
  });
})

module.exports = router
