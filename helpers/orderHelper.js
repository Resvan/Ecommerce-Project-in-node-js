const Cart = require('../models/cartModel')
const Coupon = require('../models/couponModel')
const Order = require('../models/orderModel')
const Product = require('../models/productMdoel')
const User = require('../models/userModel')
const ObjectId = require('mongoose').Types.ObjectId

const getTotalAmount = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
        let cartTotal = await Cart.aggregate([
            {
                $match: { user:ObjectId(userId)  }
            },
            {
                $unwind: '$products'
            },
            {
                $project: {
                    item: '$products.item',
                    quantity: '$products.quantity'
                }
            },
            {
                $lookup: {
                    from: 'products',
                    localField: 'item',
                    foreignField: '_id',
                    as: 'products'
                }
            },
            {
                $project: {
                    item: 1, quantity: 1, products: { $arrayElemAt: ['$products', 0] }
                }
            },
            {
                $group: {
                    _id: null,
                    total:{$sum:{$multiply:['$quantity','$products.price']}}
               }
            }
        ])
            resolve(cartTotal[0].total)
        } catch {
            resolve(0)
        }
        })
    
}


const placePurchaceOrder = (orderDetails, products, total) => {
    return new Promise(async (resolve, reject) => {
        let status = orderDetails.paymentMethod === 'COD' || orderDetails.paymentMethod === 'Wallet' ? 'placed' : 'pending'
        await Promise.all(products.map(async (item) => {
            let product = await Product.findOne({ _id: ObjectId(item.item) })
            item.total = await product.actualPrice * item.quantity
        }))
        let discount = 0;
        if (orderDetails.discount) {
            discount = parseInt(orderDetails.discount)
        }
        let order = new Order
        order.address = {
            name: orderDetails.name,
            housename: orderDetails.housename,
            town: orderDetails.town,
            district: orderDetails.district,
            state: orderDetails.state,
            pincode: orderDetails.pincode,
            email: orderDetails.email,
            phone: orderDetails.phone,
        }
        order.products = products
        order.user = ObjectId(orderDetails.userId)
        order.total = total
        order.discount = discount
        order.paymentMethod = orderDetails.paymentMethod
        order.date = new Date()
        order.status = status
        order.save().then(async (response) => {
            if (orderDetails.paymentMethod == 'Wallet') {
                await User.updateOne({ _id: orderDetails.userId },
                    {
                        $push: {
                            walletHistory: {
                                date: new Date(),
                                orderId: response._id,
                                amount: total,
                                status: "Purchaced from wallet"
                            }
                        },
                        $inc: { "wallet": -total }
                    })
            }
            if (orderDetails.coupon) {
               await Coupon.updateOne({ name: orderDetails.coupon }, {
                    $push: { users: ObjectId(orderDetails.userId) }
                })
            }
            await Cart.deleteOne({ user: ObjectId(orderDetails.userId) })
            resolve(response._id) 
        })
        
        
    })
}

const getAllOrders = (userId) => {
    return new Promise(async(resolve, reject) => {
        let orders = await Order.find({user: ObjectId(userId)}).sort({date:-1})
        console.log(orders);
        resolve(orders)
    })
}

const orderCancel = (orderId) => {
    return new Promise(async(resolve, reject) => {
        await Order.findByIdAndUpdate(orderId, { status: 'Cancelled' }).then(async (response) => {
            if (response.paymentMethod != 'COD') {
                const user = await User.findById(response.user)
                if (user.wallet) {
                    User.updateOne({ _id: user._id },
                        {
                            $push: {
                                walletHistory: {
                                    date: new Date(),
                                    orderId: orderId,
                                    amount: response.total,
                                    status: "Refund initialized"
                                }
                            },
                            $inc: { "wallet": response.total }
                        }).then(() => {
                        resolve()
                    })
                } else {
                    await User.findByIdAndUpdate(response.user, {
                        $push: {
                            walletHistory: {
                                date: new Date(),
                                orderId: orderId,
                                amount: response.total,
                                status: "Refund initialized"
                            }
                        },
                        $set: { wallet: response.total }
                    }).then(() => {
                        resolve()
                    })  
                }
                
            } else {
                resolve()
            }
            
            
        })
        
    })
}

const orderdProductsView = (orderId) => {
    return new Promise(async(resolve, reject) => {
        let orderdItems = await Order.aggregate([
            {
                $match: { _id: ObjectId(orderId) }

            },
            {
                $unwind: '$products'
            },
            {
                $project: {
                    item: '$products.item',
                    quantity: '$products.quantity',
                    size: '$products.size',
                    address: '$address'
                }
            },
            {
                $lookup: {
                    from: 'products',
                    localField: 'item',
                    foreignField: '_id',
                    as: 'product'
                }
            },
            {
                $project: {
                    item: 1, quantity: 1, size:1, address:1, product: { $arrayElemAt: ['$product', 0] }
                }
            }
        ])
        resolve(orderdItems)
    })
}

const getOneOrder = (orderId) => {
    return new Promise(async(resolve, reject) => {
        Order.findById(orderId).then((order) => {
            resolve(order)
        }) 
    })
    
}

const getActualTotal = (orderId) => {
    return new Promise(async(resolve, reject) => {
     const actualTotal = await Order.aggregate([
            {
                $match:{_id: ObjectId(orderId)}
            },
            {
                $unwind: '$products'
            },
            {
                $group: {
                    _id: null,
                    actualTotal: { $sum:'$products.total' }
                }
            }
     ])
        resolve(actualTotal[0].actualTotal)
    })
}


//<-------------------------------------------------------------------->
//<-------------------------------------------------------------------->
//<-----------------------   ADMIN   ---------------------------------->
//<-------------------------------------------------------------------->
//<-------------------------------------------------------------------->


const getAllOrdersList = () => {
    return new Promise(async(resolve, reject) => {
        let orders = await Order.find().sort({date:-1})
        resolve(orders)
    })
}

const orderStatusChange = (orderId,status) => {
    return new Promise((resolve, reject) => {
        Order.findByIdAndUpdate(orderId, { status: status }).then(async(response) => {
            if (status == 'Returned' || status == 'Cancelled') {
                const user = await User.findById(response.user)
                if (user.wallet) {
                     User.updateOne({ _id: user._id },
                        {
                            $push: {
                                walletHistory: {
                                    date: new Date(),
                                    orderId: orderId,
                                    amount: response.total,
                                    status: "Refund initialized"
                                }
                            },
                            $inc: { "wallet": response.total }
                        }).then(() => {
                        resolve()
                    })
                } else {
                    await User.findByIdAndUpdate(response.user, {
                        $set: { wallet: response.total },
                        $push: {
                            walletHistory: {
                                date: new Date(),
                                orderId: orderId,
                                amount: total,
                                status: "Refund initialized"
                            }
                        }
                    }).then(() => {
                        resolve()
                    })
                }
            }
            resolve()
        })
    })
}


module.exports = {
    getTotalAmount, placePurchaceOrder, getAllOrders, orderCancel, orderdProductsView, getAllOrdersList,
    orderStatusChange, getOneOrder, getActualTotal
}