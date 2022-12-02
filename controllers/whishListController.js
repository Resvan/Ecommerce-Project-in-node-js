const {
    addProductToWishlist, getwishListProduct, removeProductFromWishlist
} = require('../helpers/wishListHelper')

const wishlistView = async (req, res) => {
    let userId = req.session.user._id
    let wishlistItems = await getwishListProduct(userId)
    res.render('user/wishList',{wishlistItems})
}


const addtoWishlist = (req, res) => {
    let userId = req.session.user._id
    let prodId = req.params.id
    addProductToWishlist(userId, prodId).then((response) => {
        if (response.status) {
            res.json({ status: true })
        } else {
            res.json({ status: false })
        }
        
    })
}
const removeFromWishtlist = (req, res) => {
    let userId = req.session.user._id
    let prodId = req.params.id
    removeProductFromWishlist(userId, prodId).then(() => {
        res.json({status: true})
    })
}

module.exports = {
    addtoWishlist, wishlistView, removeFromWishtlist
}