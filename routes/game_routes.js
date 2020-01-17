const express = require('express')
// Connexion à MongoDB :
var mongo = require('mongodb')
var MongoClient = require('mongodb').MongoClient
var url = 'mongodb://localhost:27017/gameDB'
// const mongoose = require('mongoose')
// mongoose.connect('mongodb://localhost/mydb')

// chargement du modèle User
const User = require('../models/user.model.js')

var path = require('path')
const router = express.Router()
const session = require('cookie-session')

// Variables :

sess = {
  name: 'session',
  keys: ['username', 'password']
}
router.use(session(sess))

// Routes :

router.get('/debug', (req, res) => {
  console.log('===DEBUG===')
  console.log(sess.keys)
  res.send('Cookie : ' + sess.keys)
})

router.get('/start', (req, res) => {
  res.sendFile(path.join(__dirname, '/main_menu.html'))
})

router.get('/homeConect', (req, res) => {
  res.sendFile(path.join(__dirname, '/main_menuconnect.html'))
})

router.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, '/register.html'))
})

router.get('/deconnexion', (req, res) => {
  res.sendFile(path.join(__dirname, '/main_menu.html'))
})

router.get('/game', (req, res) => {
  res.sendFile(path.join(__dirname, '/STAN.html'))
})

router.post('/register', (req, res) => {
  console.log('truc machin register')
  const { username, password } = req.body
  MongoClient.connect(url,
    function (err, db) {
      if (err) throw err
      console.log('Database connected!')
      var dbo = db.db('gameDB')
      var result
      console.log(username + ' ' + password)

      dbo.collection('players').find({ name: username }).toArray(function (err, result) {
        console.log(result)
        if (err) throw err
        // Test d'existence :
        if (result.length === 0) {
        // Création du compte
          console.log("Création du compte avec l'ID " + username)
          dbo.collection('players').insertOne({ name: username, password: password }, function (err, res) {
            if (err) throw err
            console.log('1 document inserted')
            db.close()
          })
          var results = dbo.collection('players').find({ name: username })
          results.forEach(row => {
            console.log(row)
          })
          // Connexion
          req.session.keys = [username, password]
          sess.keys = [username, password]
          // res.render('main_menu', { success: true, message: 'Vous êtes connecté, bienvenue ' + username })
          res.sendFile(path.join(__dirname, '/main_menuconnect.html'))
        } else {
        // Le compte existe déjà
          console.log('Il y a déjà un utilisateur avec ce pseudo !')
          // res.render('main_menu', { success: false, message: 'Il y a déjà un utilisateur avec le pseudo ' + username })
          res.sendFile(path.join(__dirname, '/Mal_inscrit.html'))
        }
        db.close()
      })
    })
})

router.post('/login', (req, res) => {
  console.log('login called')
  const { username, password } = req.body
  // console.log(req.session)
  // Test d'existence :
  MongoClient.connect(url,
    function (err, db) {
      if (err) throw err
      console.log('Database connected!')
      var dbo = db.db('gameDB')

      dbo.collection('players').find({ name: username }).toArray(function (err, result) {
        if (err) throw err
        // Test d'existence :
        if (result.length === 0) {
          // Erreur username
          console.log("Erreur : l'utilisateur '" + username + "' n'existe pas !")
          // res.render('main_menu', { success: false, message: "L'utilisateur n'existe pas, veuillez réessayer" })
          res.sendFile(path.join(__dirname, '/Mal_connecte.html'))
        } else {
          // Le pseudo existe : vérification du mot de passe
          if (result[0].password === password) {
            console.log('Mot de passe correct, connexion réussie !')
            // res.render('main_menu', { success: true, message: 'Vous êtes connecté ' + username })
            res.sendFile(path.join(__dirname, '/main_menuconnect.html'))
            req.session.keys = [username, password]
            sess.keys = [username, password]
            // req.session.keys[1] = password
          } else {
            console.log('Mot de passe incorrect')
            // res.render('main_menu', { success: false, message: "Le nom d'utilisateur ou le mot de passe est incorrect, veuillez vous inscrire ou réessayer" })
            res.sendFile(path.join(__dirname, '/Mal_connecte.html'))
          }
        }
        db.close()
      })
    })
})

router.get('/play', (req, res) => {
  // res.render('game_UI')//, {page:'Home', menuId:'home'});
  var drinks = [
    { name: 'Bloody Mary', drunkness: 3 },
    { name: 'Martini', drunkness: 5 },
    { name: 'Scotch', drunkness: 10 }
  ]
  var tagline = "Any code of your own that you haven't looked at for six or more months might as well have been written by someone else."
  res.render('game_UI', { drinks: drinks, tagline: tagline })
  /* Ligne à mettre dans .ejs :
    <img src="<%= document.data.illustration.url %>" />
    */
})

module.exports = router
