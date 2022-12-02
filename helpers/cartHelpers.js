const Cart = require('../models/cartModel')
const Product = require('../models/productMdoel')
const ObjectId = require('mongoose').Types.ObjectId


const addPorductToCart = (userId, proId, size) => {
    return new Promise(async (resolve, reject) => {
        const product =await Product.findById(proId)
        let productObj = {
            item:  ObjectId(proId),
            quantity: 1,
            size: size
        }
        let userCart = await Cart.findOne({ user: ObjectId(userId) })
        if (userCart) {
            let productExist = userCart.products.findIndex(product => product.item == proId && product.size == size)
            if (productExist != -1) {
                await Cart.updateOne({user:ObjectId(userId), 'products.item': ObjectId(proId), 'products.size': size }, {
                    $inc: { 'products.$.quantity': 1 }
                })
                
                resolve()
            } else { await Cart.updateOne({ user: ObjectId(userId) }, {
                    $push: {
                        products: productObj
                    }
              })
                resolve()
            }
            
            
        } else {
            
            let cart = new Cart
                cart.user = Object(ObjectId(userId)),
                cart.products.push(productObj)
                await cart.save()
            resolve()
         }
    })
}

const getCartProduct = (userId) => {
    return new Promise(async (resolve, reject) => {
        let cartItems = await Cart.aggregate([
            {
                $match: { user: ObjectId(userId) }
            },
            {
                $unwind: '$products'
            },
            {
                $project: {
                    item: '$products.item',
                    quantity: '$products.quantity',
                    size:'$products.size'
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
                    item:1,quantity:1,size:1,products:{$arrayElemAt:['$products',0]}
                }
            }
            
        ])
        resolve(cartItems)
    })
     
}

const getCartCount = (userId) => {
    let count = 0
    return new Promise(async(resolve, reject) => {
        let cart = await Cart.findOne({ user: ObjectId(userId) })
        if (cart) {
            count = cart.products.length
        }
        resolve(count)
    })
}


const cartQuantityChange = (details) => {
    let quantity = parseInt(details.quantity)
    let count = parseInt(details.count)
    return new Promise(async (resolve, reject) => {
        if (count == -1 && quantity == 1) {
            await Cart.updateOne({ _id: ObjectId(details.cart) },
                {
                $pull:{products:{item:ObjectId(details.product)}}
                }
            ).then((response) => {
                resolve({removed:true})
            })
        } else {
             Cart.updateOne({ _id: ObjectId(details.cart), 'products.item': ObjectId(details.product) }, {
                $inc: { 'products.$.quantity': count }
            }).then(() => {
                resolve({ status: true })
            })
            
        }
     
    })
}

const cartItemRemove = (data) => {
    cartId = data.cart
    proId = data.product
    return new Promise(async(resolve, reject) => {
      await Cart.findByIdAndUpdate(cartId,
            {
                $pull: { products: { item: ObjectId(proId) } }
          }).then((response) => {
                resolve({removed:true})
            })
    })
}


const getCartProductList = (userId) => {
    return new Promise(async (resolve, reject) => {
        let cart = await Cart.findOne({ user: ObjectId(userId) })
        if (cart) {
            resolve(cart.products) 
        } else {
            resolve(0)
        }
         
        
        
    })
}

const productExistInCart = (userId, proId) => {
    return new Promise(async(resolve, reject) => {
        const userCart = await Cart.findOne({ user: ObjectId(userId) })
        if (userCart) {
            let productExist = userCart.products.findIndex(product => product.item == proId)
            if (productExist != -1) {
                resolve({status: true})
            } else {
                resolve({status: false})
            }
        } else {
            resolve({status: false})
        }
    })
}

const getCartSubTotal = (userId, proId) => {
    return new Promise(async (resolve, reject) => {
        let cartSubTotal = await Cart.aggregate([
            {
                $match: { user: ObjectId(userId) }
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
                    as: 'product'
                }
            },
            {
                $match: {
                    item: ObjectId(proId)
                }
            },
            {
                $project: {
                    item: 1, quantity: 1, product: { $arrayElemAt: ['$product', 0] }
                }
            },
            {
                $project: {
                    unitprice: { $toInt: '$product.price' },
                    quantity: { $toInt: '$quantity' }
                }
            },
            {
                $project: {
                    _id: null,
                    subtotal: { $sum: { $multiply: ['$quantity', '$unitprice'] } }
                }
            }
        ])
        if (cartSubTotal.length > 0) {
            Cart.updateOne({ user: ObjectId(userId), "products.item": ObjectId(proId) },
                {
                    $set: {
                        'products.$.subtotal': cartSubTotal[0].subtotal
                    }
                }).then((response) => {
                    resolve(cartSubTotal[0].subtotal)
                })
        }
        else {
            cartSubTotal = 0
            resolve(cartSubTotal)
        }
    })
}

module.exports = {
    addPorductToCart, getCartProduct, getCartCount, cartQuantityChange, cartItemRemove, getCartProductList, productExistInCart,
    getCartSubTotal
}