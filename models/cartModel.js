const mongoose = require('mongoose')



const cartSchema = mongoose.Schema({
    user: {
        
    },
    products: [
        
    ]
})
const Cart = mongoose.model("Cart", cartSchema);
module.exports = Cart