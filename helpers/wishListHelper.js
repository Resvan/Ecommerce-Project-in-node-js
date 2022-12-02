const WishList = require('../models/wishListModel')
const ObjectId = require('mongoose').Types.ObjectId

const addProductToWishlist = (userId, proId) => {
    return new Promise(async(resolve, reject) => {
        let userWishlist = await WishList.findOne({ user: ObjectId(userId) })
        if (userWishlist) {
            let productExist = userWishlist.products.findIndex(product => product == proId)
            if (productExist != -1) {
                await WishList.updateOne({ user: ObjectId(userId) }, {
                    $pull: {
                        products: ObjectId(proId)
                    }
                })
                resolve({status: false})
            } else {
                await WishList.updateOne({ user: ObjectId(userId) }, {
                    $push: {
                        products:ObjectId(proId)
                    }
                })
                resolve({status:true})
            }
            
        } else {
            let wishlist = new WishList
                wishlist.user = ObjectId(userId),
                wishlist.products.push(ObjectId(proId))
            await wishlist.save()
            resolve({ status: true } )
        }
    })
}


const getwishListProduct = (userId) => {
    return new Promise(async (resolve, reject) => {
        let wishlistItems = await WishList.aggregate([
            {
                $match: { user: ObjectId(userId) }
            },
            {
                $unwind: '$products'
            },
            {
                $project: {
                    product:'$products'
                }
            },
            {
                $lookup: {
                    from: 'products',
                    localField: 'product',
                    foreignField: '_id',
                    as: 'product'
                }
            },
            {
                $project: {
                    product: { $arrayElemAt: ['$product', 0] }
                }
            }
        ])
        resolve(wishlistItems)
    })

}

const removeProductFromWishlist = (userId, prodId) => {
    return new Promise(async(resolve, reject) => {
        await WishList.updateOne({ user: ObjectId(userId) }, {
            $pull: {
                products: ObjectId(prodId)
            }
        })
        resolve()
    })
}

module.exports = {
    addProductToWishlist, getwishListProduct, removeProductFromWishlist
}