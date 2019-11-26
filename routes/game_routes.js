const express = require('express')
const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/mydb')

// chargement du modèle User
const User = require("../models/user.model.js")

var path = require('path');
const router = express.Router()

router.get('/start', (req, res) => {
  res.sendFile(path.join(__dirname + '/main_menu.html'));
})

router.post('/register', (req, res) => {
  console.log("truc machin register")
  res.sendFile(path.join(__dirname + '/connecte.html'))
})

router.post('/login', (req, res) => {
  console.log("login called")
  const { username, password } = req.body
  console.log(req.session)
  if(username === 'sessId'){
    res.send(req.body.username + " existe")
  }else{
    res.send(req.body.username + " n'existe pas")
  }
})

module.exports = router
