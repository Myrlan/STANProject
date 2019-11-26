const express = require('express')
var mongo = require('mongodb')
var MongoClient = require('mongodb').MongoClient

var url = 'mongodb://localhost:27017/newdb'
// chargement du modèle User
const User = require('../models/user.model.js')

var path = require('path')
const router = express.Router()

router.get('/start', (req, res) => {
  res.sendFile(path.join(__dirname, '/main_menu.html'))
})

router.post('/register', (req, res) => {
  console.log('register called')
  const { username, password } = req.body
  console.log('informations entrées ')

  MongoClient.connect(url,
    function (err, db) {
      if (err) throw err
      console.log('Database connected!')
      var dbo = db.db('newdb')
      // Insertion (one avec un array json)
      if (username !== '' && password !== '') {
        console.log(username)
        console.log(password)

        dbo.collection('students').insertOne({ name: username, marks: password }, function (err, res) {
          if (err) throw err
          console.log('1 document inserted')
          db.close()
        })
        res.sendFile(path.join(__dirname, '/connecte.html'))
      } else {
        res.sendFile(path.join(__dirname, '/enregistrer_vous.html'))
      }
    })
})

router.post('/login', (req, res) => {
  console.log('login called')
  const { username, password } = req.body
  console.log('infos acquises')
  MongoClient.connect(url,
    function (err, db) {
      if (err) throw err
      console.log('Database connected!')
      var dbo = db.db('newdb')
      var collect = dbo.collection('students')

      // collect.forEach(element => students){
      // if (user.name === username){
      // if (user.marks === password){
      // console.log('ça marche')
      // }
      // }
      // }
      // console.log(results)

      // results.forEach(row => {
      // console.log(row.name)
      // if (username === row.name) {
      // db.close()
      // res.sendFile(path.join(__dirname, '/connecte.html'))
      // }
      // })

      db.close()
      // res.sendFile(path.join(__dirname, '/Mal_connecte.html'))
    })
})

module.exports = router
