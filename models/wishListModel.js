const mongoose = require('mongoose')



const wishListSchema = mongoose.Schema({
    user: {

    },
    products: [

    ]
})
const Wishlist = mongoose.model("Wishlist", wishListSchema);
module.exports = Wishlist