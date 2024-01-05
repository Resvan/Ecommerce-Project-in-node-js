const mongoose = require('mongoose')



const productOfferSchema = mongoose.Schema({
    product: {

    },
    offer: {

    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    }
})
const ProductOffer = mongoose.model("ProductOffer", productOfferSchema);
module.exports = ProductOffer