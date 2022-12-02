const mongoose = require('mongoose')



const productOfferSchema = mongoose.Schema({
    product: {

    },
    offer: {

    },
    startDate: {

    },
    endDate: {

    }
})
const ProductOffer = mongoose.model("ProductOffer", productOfferSchema);
module.exports = ProductOffer