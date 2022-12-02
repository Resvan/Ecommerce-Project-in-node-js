const mongoose = require('mongoose')


const productSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },

    category: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    actualPrice: {
        
    },
    proOffer: {

    },
    categOffer: {
        
    },
    offerPercentage: {
        
    },
    stock: {
        
    },
    image1: {
        type: String
    },
    image2: {
        type: String
    },
    image3: {
        type: String
    },
    image4: {
        type: String
    }
    ,
    description: {
        type: String,
        required: true
    }
})
const Product = mongoose.model("Product", productSchema);
module.exports = Product