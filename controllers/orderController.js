const {
    getTotalAmount, placePurchaceOrder, getAllOrders, orderCancel, orderdProductsView, getAllOrdersList,
    orderStatusChange, getOneOrder, getActualTotal
} = require('../helpers/orderHelper')

const {
    getCartProductList, getCartCount
} = require('../helpers/cartHelpers')
const { generateRazorpay, generatePaypal } = require('../helpers/paymentHelpers')
const { getUserDetails } = require('../helpers/userDetailsHelper')

// <----------------------   User  ------------------->

const checkOutOrder = async (req, res) => {
    res.locals.user = req.session.user
    const userId = req.session.user._id
    const cartCount = await getCartCount(userId)
    const amount = await getTotalAmount(userId)
    const user = await getUserDetails(userId)
    const address = req.session.user.address
    res.locals.cartCount = cartCount
    res.render('user/place-order', {amount, userId, address, user})
}

const placeOrder = async (req, res) => {
    const products = await getCartProductList(req.body.userId)
    let totalAmount = await getTotalAmount(req.body.userId)
    if (req.session.couponTotal) {
        totalAmount = req.session.couponTotal 
        req.session.couponTotal = null
    } 
    placePurchaceOrder(req.body, products, totalAmount).then((orderId) => {
        if (req.body.paymentMethod == 'COD') {
            res.json({ codSuccess: true })
        } else if (req.body.paymentMethod == 'Wallet') {
            res.json({ codSuccess: true })
        } else if (req.body.paymentMethod == 'Paypal') {
            generatePaypal(orderId, totalAmount).then((link) => {
                const status = 'placed'
                orderStatusChange(orderId, status)
                res.json({link,paypal: true})
            })
        } else {
            generateRazorpay(orderId, totalAmount).then((response) => {
                res.json(response)
            })
        }
        
    })
}

const orderSuccess = (req, res) => {
    res.render('user/order-success')
}

const ordersList = async (req, res) => {
    const userId = req.session.user._id
    const orders = await getAllOrders(userId)
    const cartCount = await getCartCount(userId)
    res.locals.user = req.session.user
    res.locals.cartCount = cartCount
    res.render('user/orders-List',{orders})
}

const cancelOrder = (req, res) => {
    orderCancel(req.body.order).then(() => {
        res.json({status: true})
    })
}

const viewOrderdproducts = async(req, res) => {
    let orderId = req.params.id
    let orederdItems = await orderdProductsView(orderId)
    res.render('user/ordered-products', {orederdItems})

}


const returnOrder = (req, res) => {
    const orderId = req.params.id
    const status = 'Returned'
    orderStatusChange(orderId, status).then(() => {
        res.redirect('/orders')
    })
}

const viewInvoice =async (req, res) => {
    const orderId = req.params.id
    const order = await getOneOrder(orderId)
    const actualTotal = await getActualTotal(orderId)
    res.render('user/invoice',{order, actualTotal})
}

// <-------------------------------------------------------------------->
// <-------------------------------------------------------------------->
// <---------------------------- ADMIN   --------------------------------->


const ordersView =async (req, res) => {
    let orders = await getAllOrdersList()
        res.render('admin/orders',{orders})
    }


const changeOrderStatus = (req, res) => {
    let orderId = req.body.orderId
    let  status = req.body.status
    orderStatusChange(orderId, status).then(() => {
        res.redirect('/admin/orders')
    })
}

const vieworderedProducts = async (req, res) => {
    let orderId = req.params.id
    let orederdItems = await orderdProductsView(orderId)
    res.render('admin/orderedProducts', { orederdItems })
}











module.exports = {
    checkOutOrder, placeOrder, orderSuccess, ordersList, cancelOrder, viewOrderdproducts,
    ordersView, changeOrderStatus, vieworderedProducts, returnOrder, viewInvoice
}