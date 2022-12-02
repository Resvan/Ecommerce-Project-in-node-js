const mongoose = require('mongoose')
const {Schema} = mongoose


const orderSchema = mongoose.Schema({
    address: {
       
    },
    products: [
        
    ],
    user: {
        
    },
    paymentMethod: {

    },
    total: {

    },
    discount: {
        
    },
    date: {
        
    },
    status: {

    }
})
const Order = mongoose.model("Order", orderSchema);
module.exports = Order