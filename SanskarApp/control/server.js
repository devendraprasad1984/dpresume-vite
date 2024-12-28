var express = require('express')
var cors = require('cors')  //use this
var app = express()

app.use('/',cors(),express.static(__dirname + '/'));

app.get('/user/:id',cors(), function (req, res, next) {
    res.json({user: 'CORS enabled'})
})

app.listen(8081, function () {
    console.log('CORS-enabled web server listening on port 8081')
})
