const express = require('express')
const mongodb = require('mongodb')
const sanitizeHTML = require('sanitize-html')
require('dotenv').config()

const app = express()

app.use(express.static('public'))
app.use(express.json())

let database

let port = process.env.PORT || 5000

mongodb.connect(process.env.CONNECTION_STRING, {useNewUrlParser: true, useUnifiedTopology: true}, function(err, client) {
  database = client.db()
  app.listen(port)
})

app.get('/', function(req, res) {
  database.collection('items').find().toArray((err, item) => {
    res.send(`<!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Simple To-Do App</title>
      <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.2.1/css/bootstrap.min.css" integrity="sha384-GJzZqFGwb1QTTN6wy59ffF1BuGJpLSa9DkKMp0DgiMDm4iYMj70gZWKYbI706tWS" crossorigin="anonymous">
    </head>
    <body>
      <div class="container">
        <h1 class="display-4 text-center py-1">To-Do App</h1>
        
        <div class="jumbotron p-3 shadow-sm">
          <form id="item-form">
            <div class="d-flex align-items-center">
              <input id="input-field" autofocus autocomplete="off" class="form-control mr-3" type="text" style="flex: 1;">
              <button class="btn btn-primary">Add New Item</button>
            </div>
          </form>
        </div>
        
        <ul id="item-list" class="list-group pb-5">
        
        </ul>
        
      </div>
      <script>let objects = ${JSON.stringify(item)}</script>
      <script src="./features.js"></script>
      <script src="https://unpkg.com/axios/dist/axios.min.js"></script>
    </body>
    </html>`)
  })
})

app.post('/create-object', function(req, res) {
  let verText = sanitizeHTML(req.body.text, {allowedTags: [], allowedAttributes: []})
  database.collection('items').insertOne({text: verText}, function(err, info) {
    res.json(info.ops[0])
  })
})

app.post('/update-object', (req, res)=>{
  let verText = sanitizeHTML(req.body.text, {allowedTags: [], allowedAttributes: []})
  database.collection('items').findOneAndUpdate({_id: new mongodb.ObjectID(req.body.id)}, {$set: {text: verText}}, ()=>{
    res.send("")
  })
})


app.post('/delete-object', (req, res)=>{
  database.collection('items').deleteOne({_id: new mongodb.ObjectID(req.body.id)}, {$set: {text: req.body.text}}, ()=>{
    res.send("")
  })
})