const mongoose = require('mongoose')



const categoryOfferSchema = mongoose.Schema({
    category: {

    },
    offer: {
        
    },
    startDate: {

    },
    endDate: {

    }
})
const CategoryOffer = mongoose.model("CategoryOffer", categoryOfferSchema);
module.exports = CategoryOffer