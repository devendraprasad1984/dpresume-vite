const controllers = require('./controllers')
const passportService = require('./services/passport')
const passport = require('passport')

const requireAuth = passport.authenticate('jwt', {session: false}) //this is middleware interceptor for auth for each incoming request
const requireSignin = passport.authenticate('local', {session: false})

//in python, its done via decorator pattern and attachment over each api call
module.exports = function (app) {
    app.use(passport.initialize()) //init this before routes registration
    app.get('/', requireAuth, function (req, res, next) {
        res.send({msg: 'hello home page', auth: true})
    })
    app.post('/signin', requireSignin, controllers.authController.signin)
    app.post('/signup', controllers.authController.signup)
}