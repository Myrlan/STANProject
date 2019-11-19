const express = require('express')
const session = require('express-session')
const game_routes_ref = require('./routes/game_routes.js')
const bodyParser = require('body-parser') // pour parser les requêtes POST

// const mongoose = require('mongoose')
// mongoose.connect('mongodb://localhost/mydb')

const app = express()
app.use(bodyParser.urlencoded({ extended: false })) // for simple form posts
app.use(bodyParser.json()) // for API requests

sess = {
  secret: 'mydirtylittlesecret',
  name: 'sessId'
}
app.use(session(sess))

app.get('/', (req, res) => {
  res.send('ok');
  req.session = sess
  console.log(req.session)
})

app.use('/', game_routes_ref)

app.listen(3000, function () {
  console.log('Application démarrée sur le port 3000!')
  var opn = require('opn')
  opn('http://localhost:3000/start')
})
