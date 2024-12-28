//this is like a centralised middleware that is being intercepted at every incoming call and is checking isUserLoggedIn for auth requests
const passport = require('passport')
const JwtStrategy = require('passport-jwt').Strategy
const User = require('../models/user')
const config = require('../config')
const ExtractJwt = require('passport-jwt').ExtractJwt
const localStrategy = require('passport-local')

//setup options for jwt strategy
const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromHeader('authorization'),
    secretOrKey: config.secret
}
//create local strategy using email and password
const localOptions = {usernameField: 'email', passwordField: 'password'}
const localLogin = new localStrategy(localOptions, function (email, password, done) {
    //verify this username and password, call done, if it is, else call false
    User.findOne({email: email}, (err, user) => {
        if (err) return done(err)
        if (!user) return done(null, false)
        //compare passwords - is pwd = user.password?
        user.comparePassword(password, function (err, isMatch) {
            if (err) return done(err)
            if (!isMatch) return done(null, isMatch)
            return done(null, user)
        })
    })
})

//create jwt strategy
const jwtLogin = new JwtStrategy(jwtOptions, function (payload, done) {
    //see if the userid in payload exists in db
    //if it does call, done with that user
    //else call done without a user object
    User.findById(payload.sub, function(err, user) {
        if (err) return done(err, false)
        if (user) {
            return done(null, user)
        } else {
            return done(null, false)
        }
    })
})
//tell passport to use it
passport.use(jwtLogin)
passport.use(localLogin)