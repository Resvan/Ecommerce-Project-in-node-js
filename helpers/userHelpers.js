const bcrypt = require('bcrypt')
const User = require('../models/userModel')

module.exports = {
    secureUser: (userData) => {
        return new Promise(async (resolve, reject) => {
            let response = {}
            let user = await User.findOne({ email: userData.email })
            let phone = await User.findOne({phone: userData.phone})
            if (user) {
                response.error = "Email already exists"
                response.status = false
                resolve(response)

            } else if (phone) {
                response.error = "Mobile number already exists"
                response.status = false
                resolve(response)
                
            }else {
                userData.password = await bcrypt.hash(userData.password, 10)
                const user = new User(userData)
                user.save()
                resolve(response.status = true)

            }


        })


    },
    findUserWithPhone: (phone) => {
        return new Promise((resolve, reject) => {
            User.findOne({ phone: phone }).then((response) => {
                resolve(response)
            })
        })
    },
}