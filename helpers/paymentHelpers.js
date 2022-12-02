const Razorpay = require('razorpay');
const paypal = require('paypal-rest-sdk');


paypal.configure({
    'mode': 'sandbox', //sandbox or live
    'client_id': process.env.CLIENT_ID,
    'client_secret': process.env.CLIENT_SCERET
});


var instance = new Razorpay({
    key_id: process.env.KEY_ID,
    key_secret: process.env.KEY_SCECRET,
});
const generateRazorpay = (orderId, total) => {
    return new Promise((resolve, reject) => {
        instance.orders.create({
            amount: total*100,
            currency: "INR",
            receipt: ""+orderId,
            notes: {
                key1: "value3",
                key2: "value2"
            }
        }, (err, order) => {
            resolve(order)
        }) 
    })
}

const verifyRazorpay = (details) => {
    return new Promise((resolve, reject) => {
        const crypto = require('crypto')
        let hmac = crypto.createHmac('sha256', process.env.KEY_SCECRET)

        hmac.update(details['payment[razorpay_order_id]'] + '|' + details['payment[razorpay_payment_id]'])
        hmac = hmac.digest('hex')
        if (hmac == details['payment[razorpay_signature]']) {
            resolve()
        } else {
            reject()
        }

    })
}
const generatePaypal = (orderId,total) => {
    return new Promise((resolve, reject) => {
        var create_payment_json = {
            "intent": "sale",
            "payer": {
                "payment_method": "paypal"
            },
            "redirect_urls": {
                "return_url": "http://localhost:5000/order-success",
                "cancel_url": "http://localhost:5000/place-order"
            },
            "transactions": [{
                "item_list": {
                    "items": [{
                        "name": "item",
                        "sku": "item",
                        "price": total,
                        "currency": "USD",
                        "quantity": 1
                    }]
                },
                "amount": {
                    "currency": "USD",
                    "total": total
                },
                "description": "This is the payment description."
            }]
        };
        paypal.payment.create(create_payment_json, function (error, payment) {
            if (error) {
                throw error;
            } else {
                console.log("Create Payment Response");
                console.log(payment, 'payment type');
                console.log(payment.links[1].href);
                resolve(payment.links[1].href)
            }
        });
    })
    
}


module.exports = {
    generateRazorpay, verifyRazorpay, generatePaypal
}