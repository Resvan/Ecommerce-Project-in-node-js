const bcrypt = require('bcrypt')
const User = require('../models/userModel')

const getUserDetails = (userId) => {
    return new Promise(async(resolve, reject) => {
        const user = await User.findById(userId)
        resolve(user)
    })
}


const addAddress = (userId,details) => {
    return new Promise(async(resolve, reject) => {
        await User.findByIdAndUpdate(userId, {
            $push:{'address':details}
        })
        resolve({success:true})
    })
}

const deleteAddress = (userId, addressId) => {
    return new Promise(async(resolve, reject) => {
        await User.findByIdAndUpdate(userId, {
            $pull: {
                address: { id: addressId }
            }
        })
        resolve({status:true})
    })
}

const editDetails = (userId, data) => {
    return new Promise(async (resolve, reject) => {
        const userEmail = await User.find({ $and: [{ email: data.email }, { _id: { $ne: userId } }] }).count()
        const userPhone = await User.find({ $and: [{ phone: data.phone }, { _id: { $ne: userId } }] }).count()
        if (userEmail != 0) {
            reject({message: 'Email exist'})
        } else if (userPhone != 0) {
            reject({message: 'Phone number exist'})
        } else {
            await User.findByIdAndUpdate(userId, {
                $set: {
                    name: data.name,
                    email: data.email,
                    phone: data.phone
                }
            })
            resolve()
        }
    })
}

const changePassword = (userId, data) => {
    console.log(data);
    return new Promise(async (resolve, reject) => {
        const user = await User.findById(userId)
        bcrypt.compare(data.password, user.password).then(async (status) => {
            if (status) {
                data.password = await bcrypt.hash(data.password, 10)
                await User.findByIdAndUpdate(userId, {
                    $set:{password:data.password}
                })
                resolve({status: true})
            } else {
                reject({status: false})
            }
        })
    })
}

module.exports = {
    getUserDetails, addAddress, deleteAddress, editDetails, changePassword
}