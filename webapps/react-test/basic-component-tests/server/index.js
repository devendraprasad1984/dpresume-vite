//main starting point of application, this is ES5 syntax
const express = require('express')
const http = require('http')
const bodyParser = require('body-parser') //parse incoming requests specific into json
const morgan = require('morgan') //logging incoming framework
const router = require('./router')
const mongoose = require('mongoose')
const cors = require('cors')

//stephengrider: https://github.com/StephenGrider/AdvancedReduxCode
//db setup
mongoose.connect('mongodb://localhost:27017/db_comments')


//app setup
const app = express()
//below two are app middlewares, any calls to this express server, first is being intercepted by morgan and bodyparser
app.use(cors({
    origin: '*',
    "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
    "preflightContinue": false,
    "optionsSuccessStatus": 204
}))
app.use(morgan('combined'))
app.use(bodyParser.json({type: '*/*'}))
router(app)

//server setup
const port = process.env.PORT || 3090
const server = http.createServer(app)
server.listen(port)
console.log('server listening on: ', port)
