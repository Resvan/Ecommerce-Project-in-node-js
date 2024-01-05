const mongoose = require('mongoose')



const categoryOfferSchema = mongoose.Schema({
    category: {

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
const CategoryOffer = mongoose.model("CategoryOffer", categoryOfferSchema);
module.exports = CategoryOffer