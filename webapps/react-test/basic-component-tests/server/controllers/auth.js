const Users = require('../models/user')
const jwt = require('jwt-simple')
const config = require('../config')

function tokenForUser(user) {
    const timestamp = new Date().getTime()
    return jwt.encode({sub: user.id, iat: timestamp}, config.secret)
}

module.exports.signup = function (req, res, next) {
    // console.log(req.body)
    const email = req.body.email
    const password = req.body.password
    if (!email || !password) {
        return res.status(422).send({error: 'email or password is missing!'})
    }

    Users.findOne({email: email}, (err, data) => {
        if (err) {
            return next(err)
        }
        if (data) {
            return res.status(422).send({error: 'email is in use'})
        }
        const user = new Users({
            email: email, password: password
        })
        user.save((err) => {
            if (err) return next(err)
            res.json({success: true, token: tokenForUser(user)})
        })
    })
}

module.exports.signin = function (req, res, next) {
    //user has already email and pwd auth'd and we need to give token back
    //passport done(null, user) when used as middleware, assigns it to request object via router
    res.send({token: tokenForUser(req.user)})
}