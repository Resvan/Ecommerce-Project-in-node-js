const {
    verifyRazorpay
} = require('../helpers/paymentHelpers')
const {
    orderStatusChange
}= require('../helpers/orderHelper')

const verifyRazorpayPayment = (req, res) => {
    verifyRazorpay(req.body).then(() => {
        let status = 'placed'
        orderStatusChange(req.body['order[receipt]'],status).then(() => {
            res.json({status:true})
        })
    }).catch((err) => {
        res.json({status:false})
    })
}

module.exports = {
    verifyRazorpayPayment
}