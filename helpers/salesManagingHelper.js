const moment = require('moment/moment')
const Order = require('../models/orderModel')

// monthly report
const monthlyReport = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let start = new Date(new Date() - 1000 * 60 * 60 * 24 * 30)
            let end = new Date()

            let orderSuccess = await Order.find({ date: { $gte: start, $lte: end }, status: { $nin: ['Cancelled', "Returned"] } }).sort({ date: -1 })
            var i;
            for (i = 0; i < orderSuccess.length; i++) {
                orderSuccess[i].date = moment(orderSuccess[i].date).format('lll')
            }
            let orderTotal = await Order.find({ date: { $gte: start, $lte: end } })
            let orderSuccessLength = orderSuccess.length
            let orderTotalLength = orderTotal.length
            let orderFailLength = orderTotalLength - orderSuccessLength
            let total = 0
            let razorpay = 0
            let cod = 0
            let paypal = 0
            let wallet = 0

            for (let i = 0; i < orderSuccessLength; i++) {
                total = total + orderSuccess[i].total
                if (orderSuccess[i].paymentMethod === 'COD') {
                    cod++
                } else if (orderSuccess[i].paymentMethod === 'Paypal') {
                    paypal++
                } else if (orderSuccess[i].paymentMethod === 'Razorpay') {
                    razorpay++
                }
                else {
                    wallet++
                }
            }

            let productCount = await Order.aggregate([
                {
                    $match: {
                        $and: [{
                            status: { $nin: ["Cancelled", "Returned"] }
                        },
                        { date: { $gte: start, $lte: end } }]

                    },

                },
                {
                    $project: {
                        _id: 0,
                        quantity: '$products.quantity'

                    }
                },
                {
                    $unwind: '$quantity'
                },
                {
                    $group: {
                        _id: null,
                        total: { $sum: '$quantity' }
                    }
                }
            ])
            var data = {
                start: moment(start).format('YYYY/MM/DD'),
                end: moment(end).format('YYYY/MM/DD'),
                totalOrders: orderTotalLength,
                successOrders: orderSuccessLength,
                failOrders: orderFailLength,
                totalSales: total,
                cod: cod,
                paypal: paypal,
                razorpay: razorpay,
                wallet: wallet,
                productCount: productCount[0].total,

                currentOrders: orderSuccess
            }
            resolve(data)
        }
        catch {
            resolve(0)
        }
    })
}

// get report
const getReport = (startDate, endDate) => {
    return new Promise(async (resolve, reject) => {
        try {
            let start = new Date(startDate)
            let end = new Date(endDate)

            let orderSuccess = await Order.find({ date: { $gte: start, $lte: end }, status: { $nin: ['Cancelled', "Returned"] } }).sort({ Date: -1, Time: -1 })
            let orderTotal = await Order.find({ date: { $gte: start, $lte: end } })
            let orderSuccessLength = orderSuccess.length
            let orderTotalLength = orderTotal.length
            let orderFailLength = orderTotalLength - orderSuccessLength
            let total = 0

            let razorpay = 0
            let cod = 0
            let paypal = 0
            let wallet = 0
            let productCount = 0
            for (let i = 0; i < orderSuccessLength; i++) {
                total = total + orderSuccess[i].total
                if (orderSuccess[i].paymentMethod === 'COD') {
                    cod++
                } else if (orderSuccess[i].paymentMethod === 'Paypal') {
                    paypal++
                } else if (orderSuccess[i].paymentMethod === 'Razorpay') {
                    razorpay++
                }
                else {
                    wallet++
                }
            }
            productCount = await Order.aggregate([
                {
                    $match: {
                        $and: [{
                            status: { $nin: ["Cancelled", "Returned"] }
                        },
                        { date: { $gte: start, $lte: end } }]

                    },

                },
                {
                    $project: {
                        _id: 0,
                        quantity: '$products.quantity'

                    }
                },
                {
                    $unwind: '$quantity'
                },
                {
                    $group: {
                        _id: null,
                        total: { $sum: '$quantity' }
                    }
                }
            ])
            var data = {
                start: moment(start).format('YYYY/MM/DD'),
                end: moment(end).format('YYYY/MM/DD'),
                totalOrders: orderTotalLength,
                successOrders: orderSuccessLength,
                failOrders: orderFailLength,
                totalSales: total,
                cod: cod,
                paypal: paypal,
                razorpay: razorpay,
                wallet: wallet,
                productCount: productCount[0].total,
                currentOrders: orderSuccess
            }
            resolve(data)
        } catch {
            resolve(0)
        }
    })
}
const dailyReport = () => {
    return new Promise(async (resolve, reject) => {
        try {

            let start = new Date(new Date() - 1000 * 60 * 60 * 24)
            let end = new Date()

            let orderSuccess = await Order.find({ date: { $gte: start, $lte: end }, status: { $nin: ['Cancelled', "Returned"] } }).sort({ Date: -1, Time: -1 })

            let orderTotal = await Order.find({ date: { $gte: start, $lte: end } })
            let orderSuccessLength = orderSuccess.length
            let orderTotalLength = orderTotal.length
            let orderFailLength = orderTotalLength - orderSuccessLength
            let total = 0
            let razorpay = 0
            let cod = 0
            let paypal = 0
            let wallet = 0
            let productCount = 0
            for (let i = 0; i < orderSuccessLength; i++) {
                total = total + orderSuccess[i].total
                if (orderSuccess[i].paymentMethod === 'COD') {
                    cod++
                } else if (orderSuccess[i].paymentMethod === 'Paypal') {
                    paypal++
                } else if (orderSuccess[i].paymentMethod === 'Razorpay') {
                    razorpay++
                }
                else {
                    wallet++
                }
            }
            productCount = await Order.aggregate([
                {
                    $match: {
                        $and: [{
                            status: { $nin: ["Cancelled", "Returned"] }
                        },
                        { date: { $gte: start, $lte: end } }]

                    },

                },
                {
                    $project: {
                        _id: 0,
                        quantity: '$products.quantity'

                    }
                },
                {
                    $unwind: '$quantity'
                },
                {
                    $group: {
                        _id: null,
                        total: { $sum: '$quantity' }
                    }
                }
            ])
            var data = {
                start: moment(start).format('YYYY/MM/DD'),
                end: moment(end).format('YYYY/MM/DD'),
                totalOrders: orderTotalLength,
                successOrders: orderSuccessLength,
                failOrders: orderFailLength,
                totalSales: total,
                cod: cod,
                paypal: paypal,
                razorpay: razorpay,
                wallet: wallet,
                productCount: productCount[0].total,
                averageRevenue: total / productCount[0].total,
                currentOrders: orderSuccess
            }
            resolve(data)
        } catch {
            resolve(0)
        }
    })
}

// weekly report
const weeklyReport = () => {
    return new Promise(async (resolve, reject) => {
        try {

            let start = new Date(new Date() - 1000 * 60 * 60 * 24 * 7)

            let end = new Date()

            let orderSuccess = await Order.find({ date: { $gte: start, $lte: end }, status: { $nin: ['Cancelled', "Returned"] } }).sort({ Date: -1, Time: -1 })
            let orderTotal = await Order.find({ date: { $gte: start, $lte: end } })
            let orderSuccessLength = orderSuccess.length
            let orderTotalLength = orderTotal.length
            let orderFailLength = orderTotalLength - orderSuccessLength
            let total = 0
            let razorpay = 0
            let cod = 0
            let paypal = 0
            let wallet = 0
            let productCount = 0
            for (let i = 0; i < orderSuccessLength; i++) {
                total = total + orderSuccess[i].total
                if (orderSuccess[i].paymentMethod === 'COD') {
                    cod++
                } else if (orderSuccess[i].paymentMethod === 'Paypal') {
                    paypal++
                } else if (orderSuccess[i].paymentMethod === 'Razorpay') {
                    razorpay++
                }
                else {
                    wallet++
                }
            }

            productCount = await Order.aggregate([
                {
                    $match: {
                        $and: [{
                            status: { $nin: ["Cancelled", "Returned"] }
                        },
                        { date: { $gte: start, $lte: end } }]

                    },

                },
                {
                    $project: {
                        _id: 0,
                        quantity: '$products.quantity'

                    }
                },
                {
                    $unwind: '$quantity'
                },
                {
                    $group: {
                        _id: null,
                        total: { $sum: '$quantity' }
                    }
                }
            ])

            var data = {
                start: moment(start).format('YYYY/MM/DD'),
                end: moment(end).format('YYYY/MM/DD'),
                totalOrders: orderTotalLength,
                successOrders: orderSuccessLength,
                failOrders: orderFailLength,
                totalSales: total,
                cod: cod,
                paypal: paypal,
                razorpay: razorpay,
                wallet: wallet,
                productCount: productCount[0].total,
                averageRevenue: total / productCount[0].total,

                currentOrders: orderSuccess
            }
            resolve(data)
        } catch {
            resolve(0)
        }
    })
}

// yearly report
const yearlyReport = () => {
    return new Promise(async (resolve, reject) => {
        try {

            let start = new Date(new Date() - 1000 * 60 * 60 * 24 * 365)

            let end = new Date()

            let orderSuccess = await Order.find({ date: { $gte: start, $lte: end }, status: { $nin: ['Cancelled', "Returned"] } }).sort({ Date: -1, Time: -1 })
            let orderTotal = await Order.find({ date: { $gte: start, $lte: end } })
            let orderSuccessLength = orderSuccess.length
            let orderTotalLength = orderTotal.length
            let orderFailLength = orderTotalLength - orderSuccessLength
            let total = 0
            let razorpay = 0
            let cod = 0
            let paypal = 0
            let wallet = 0
            let productCount = 0
            for (let i = 0; i < orderSuccessLength; i++) {
                total = total + orderSuccess[i].total
                if (orderSuccess[i].paymentMethod === 'COD') {
                    cod++
                } else if (orderSuccess[i].paymentMethod === 'paypal') {
                    paypal++
                } else if (orderSuccess[i].paymentMethod === 'Razorpay') {
                    razorpay++
                }
                else {
                    wallet++
                }
            }

            productCount = await Order.aggregate([
                {
                    $match: {
                        $and: [{
                            status: { $nin: ["Cancelled", "Returned"] }
                        },
                        { date: { $gte: start, $lte: end } }]

                    },

                },
                {
                    $project: {
                        _id: 0,
                        quantity: '$products.quantity'

                    }
                },
                {
                    $unwind: '$quantity'
                },
                {
                    $group: {
                        _id: null,
                        total: { $sum: '$quantity' }
                    }
                }
            ])

            var data = {
                start: moment(start).format('YYYY/MM/DD'),
                end: moment(end).format('YYYY/MM/DD'),
                totalOrders: orderTotalLength,
                successOrders: orderSuccessLength,
                failOrders: orderFailLength,
                totalSales: total,
                cod: cod,
                paypal: paypal,
                razorpay: razorpay,
                wallet: wallet,
                productCount: productCount[0].total,

                averageRevenue: total / productCount[0].total,

                currentOrders: orderSuccess
            }
            resolve(data)
        } catch {
            resolve(0)
        }
    })
}
const categoryWiseSales = () => {
    return new Promise(async(resolve, reject) => {
        try {
            const data = await Order.aggregate([
                {
                    $match: {
                        status: { $nin: ['Cancelled', "Returned"]}
                    }
                },
                {
                    $project: {
                        _id: 0,
                        product: '$products.item',
                        quantity: '$products.quantity'

                    }
                },
                {
                    $unwind: '$product'
                },
                {
                    $unwind: '$quantity'
                },
                {
                    $lookup: {
                        from: 'products',
                        localField: 'product',
                        foreignField: '_id',
                        as: 'prod'
                    }
                },
                {
                    $unwind: '$prod'
                },
                {
                    $project: {
                        _id: 0,
                        quantity: 1,
                        category: '$prod.category',
                        price: { $multiply: ['$quantity', '$prod.price'] }

                    }
                },
                {
                    $group: {
                        _id: '$category',
                        count: { $sum: '$quantity' },
                        total: { $sum: '$price' }

                    }
                }
            ])
            resolve(data)
            
        }catch{
            resolve(0)
        }
    })
}

module.exports = {
    monthlyReport, getReport, dailyReport, weeklyReport, yearlyReport, categoryWiseSales
}