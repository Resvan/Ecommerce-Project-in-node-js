const User = require('../models/userModel')
const bcrypt = require('bcrypt')

module.exports = {
    doLogin: (userData) => {
        return new Promise(async (resolve, reject) => {
            let response = {}
            let user = await User.findOne({ email: userData.email })
            if (user) {
                if (user.isActive) {
                    bcrypt.compare(userData.password, user.password).then((status) => {
                        if (status) {
                            response.user = user
                            response.status = true
                            resolve(response)
                        } else {
                            response.error = 'Password incorrect'
                            response.status = false
                            reject(response)
                        }
                    })  
                } else {
                    response.status = false
                    response.error = 'User is blocked'
                    reject(response)
                 }
                
            } else {
                response.error = 'User Not Found'
                response.status = false
                reject(response)
            }
        })
    }
}