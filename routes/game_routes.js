const express = require('express')

// chargement du modèle User
const User = require('../models/user.model.js')

var path = require('path')
const router = express.Router()

router.get('/start', (req, res) => {
  res.sendFile(path.join(__dirname + '/main_menu.html'))
})

router.post('/register', (req, res) => {

})

router.post('/login', (req, res) => {
  console.log('login called')
  const { username, password } = req.body
  console.log(req.session)
  if (username === 'sessId') {
    res.sendFile(path.join(__dirname + '/connecte.html'))
  } else {
    res.sendFile(path.join(__dirname + '/Mal_connecte.html'))
  }
})

module.exports = router
