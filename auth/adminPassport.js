const bcrypt = require('bcrypt')
const LocalStrategy = require('passport-local')
// Load model
const Admin = require('../models/adminModel');
const loginCheck = (passport) => {
    const authenticateAdmin = async (email, password, done) => {
        const admin = await Admin.findOne({ email: email })

        if (admin) {
            bcrypt.compare(password, admin.password).then((status) => {
                if (status) {
                    return done(null, admin)
                } else {
                    return done(null, false, { message: 'Password Incorrect' })
                }
            })
        } else {
            return done(null, false, { message: 'No user with this email' })
        }

    }
    passport.use('local', new LocalStrategy({ usernameField: 'email' }, authenticateAdmin))
    passport.serializeUser(function (user, done) {
        done(null, user)
    })
    passport.deserializeUser(function (user, done) {
        done(null, user)
    })
}


module.exports = {
    loginCheck
} 
