const express = require('express')
const session = require('express-session')
const game_routes_ref = require('./routes/game_routes.js')
const bodyParser = require('body-parser') // pour parser les requêtes POST
// var mongo = require('mongodb')
// var MongoClient = require('mongodb').MongoClient

// var url = 'mongodb://localhost:27017/newdb'

// MongoClient.connect(url,
// function (err, db) {
// if (err) throw err
// console.log('Database connected!')
// var dbo = db.db('newdb')
// Insertion (one et many avec un array json)
// dbo.collection('students').insertOne({ name: 'Abhishek', marks: 100 }, function (err, res) {
// if (err) throw err
// console.log('1 document inserted')
// var results = dbo.collection('students').find({})
// results.forEach(row => {
// console.log(row)
// })
// var results = dbo.collection('students').find({})
// results.forEach(row => {
// console.log(row)
// })
// db.close()
// })

const app = express()
app.use(bodyParser.urlencoded({ extended: false })) // for simple form posts
app.use(bodyParser.json()) // for API requests

sess = {
  secret: 'mydirtylittlesecret',
  name: 'sessId'
}
app.use(session(sess))

app.get('/', (req, res) => {
  res.send('ok')
  req.session = sess
  console.log(req.session)
})

app.use('/', game_routes_ref)

app.listen(3000, function () {
  console.log('Application démarrée sur le port 3000!')
  var opn = require('opn')
  opn('http://localhost:3000/start')
})
