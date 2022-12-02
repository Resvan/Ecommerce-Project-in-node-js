const mongoose = require('mongoose')



const couponSchema = mongoose.Schema({
    name: {

    },
    starting: {
    },
    expiry: {
    },
    offer: {
    },
    startDate: {
        
    },
    endDate: {
        
    },
    users: [

    ]
})
const Coupon = mongoose.model("Coupon", couponSchema);
module.exports = Coupon