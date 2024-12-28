//local definition for user model as per DB
//this will tell mongoose ORM to have it mapped to mongo DB
const mongoose = require('mongoose')
const schema = mongoose.Schema
const bcrypt = require('bcrypt-nodejs')

//define our model
const userSchema = new schema({
    email: {
        type: schema.Types.String,
        unique: true,
        lowercase: true
    },
    password: schema.Types.String
})

//on save hook, encrypt password
userSchema.pre('save', function (next) {
    const user = this
    bcrypt.genSalt(10, function (err, salt) {
        if (err) return next(err)
        bcrypt.hash(user.password, salt, null, function(err, hash) {
            if (err) return next(err)
            user.password = hash
            next()
        })
    })
})

userSchema.methods.comparePassword = function (candidatePwd, callback) {
    bcrypt.compare(candidatePwd, this.password, function (err, isMatch) {
        if (err) return callback(err)
        callback(null, isMatch)
    })
}


//create the model class and export
const userModelClass = mongoose.model('user', userSchema)
module.exports = userModelClass
