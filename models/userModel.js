const mongoose = require('mongoose')



const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },

    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true

    },
    address: [
        
    ],
    isActive: {
        type: Boolean,
        default: true
    },
    wallet: {
        type: Number
    },
    walletHistory: [
        
    ]
})
const User = mongoose.model("User", userSchema);
module.exports = User