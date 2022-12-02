const Admin = require('../models/adminModel')
const User = require('../models/userModel')
const Category = require('../models/categoryModel')
const bcrypt = require('bcrypt')


module.exports = {
    secureAdmin: (adminData) => {
        let response = {}
        return new Promise(async (resolve, reject) => {
            let user = await Admin.findOne({ email: adminData.email })
            if (user) {
                resolve(response.status = false)

            } else {
                adminData.password = await bcrypt.hash(adminData.password, 10)
                const admin = new Admin(adminData)
                admin.save()
                resolve(response.status = true)

            }


        })


    },
    getAllUser: () => {
        return new Promise(async(resolve, reject) => {
            let users = await User.find()
            resolve(users)
        })
    },
    userBlock: (userData) => {
        return new Promise((resolve, reject) => {
            User.updateOne({ email: userData }, { isActive: false }).then((response) => {
                if (response) {
                    resolve(response)
                }
            })
        })
    },
    userUnblock: (userData) => {
        return new Promise((resolve, reject) => {
            User.updateOne({ email: userData }, { isActive: true }).then((response) => {
                if (response) {
                    resolve(response)
                }
            })
        })
    },


    categoryAdd: (categoryName) => {
        let response= {}
        return new Promise(async(resolve, reject) => {
            let category = await Category.findOne({ name: categoryName.name })
            if (category) {
                response.error = 'Category alreay exists'
                response.status = false
                resolve(response)

            } else {
                const categ = new Category(categoryName)
                categ.save()
                response.status = true
                resolve(response)

            }
        })
    },

    categoryEditview: (categId) => {
        return new Promise(async (resolve, reject) => {
            let category = await Category.findOne({_id: Object(categId)  })
            resolve(category)
        })
    },
    categoryEdit: (newCteg) => {
        return new Promise(async (resolve, reject) => {
            let response = {}
            let category = await Category.findOne({ name: newCteg.name })
            if (category) {
                response.error = "Category already exists"
                response.status = false
                resolve(response)
            } else {
                Category.updateOne({ _id: newCteg.id }, { name: newCteg.name }).then(() => {
                    response.status = true
                    resolve(response)
                })
            }
        })
    },

    Categorydelete: (categId) => {
        return new Promise(async(resolve, reject) => {
            let response = {}
           await Category.deleteOne({ _id: Object(categId) }).then(() => {
                response.message = 'Category deleted successfully'
                resolve(response)
            })
        })

    },
    getAllCategory: () => {
        return new Promise(async(resolve, reject) => {
            let categories = Category.find()
            resolve(categories)
        })
    }
}
