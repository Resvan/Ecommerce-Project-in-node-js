const {
    addPorductToCart, getCartProduct, getCartCount, cartQuantityChange, cartItemRemove, getCartSubTotal
    
} = require('../helpers/cartHelpers')
const {
    getTotalAmount
} = require('../helpers/orderHelper')


const addToCart = (req, res) => {
    let userId = req.session.user._id
    let prodId = req.params.id
    let size = req.query.size
    addPorductToCart(userId, prodId,size).then(() => {
        res.json({status : true})
    })
}
// Cart
const viewCart =async (req, res) => {
    let userId = req.session.user._id
    let cartItems = await getCartProduct(userId) 
    let totalValue = await getTotalAmount(userId)
    let cartCount = await getCartCount(userId)
    res.locals.user = req.session.user
    res.locals.cartCount = cartCount
    res.render('user/cart', { cartItems, totalValue, userId })
    
}


const changeCartQuantity = (req, res) => {
    let userId = req.body.user
    const proId = req.body.product
    cartQuantityChange(req.body).then(async (response) => {
        response.total = await getTotalAmount(userId)
        response.cartSubTotal = await getCartSubTotal(userId, proId)
        res.json( response )
    })
}


const removeCartItem = (req, res) => {
    cartItemRemove(req.body).then((response) => {
        res.json( response )
    })
}



module.exports = {
    addToCart, viewCart, changeCartQuantity, removeCartItem
}