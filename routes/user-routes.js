const express = require('express')
const router = express.Router()
const productController = require('../controllers/productController')
const userController = require('../controllers/userController')
const {
    addToCart, viewCart, changeCartQuantity, removeCartItem
} = require('../controllers/cartController')

const {
        checkOutOrder, placeOrder, orderSuccess, ordersList, cancelOrder, viewOrderdproducts,
        returnOrder, viewInvoice

} = require('../controllers/orderController')

const { 
        addtoWishlist, wishlistView, removeFromWishtlist
        
} = require('../controllers/whishListController')
 
const {
        verifyRazorpayPayment
} = require('../controllers/paymentController')

const {
        applyCoupon
} = require('../controllers/couponController')






        //Get Home Page

router.get('/', userController.viewHome)

        
        //Get Home Page

router.get('/shop', userController.viewShop)
router.get('/product-details',  productController.getProductView)

        // User Login

router.get('/login',  userController.viewLogin)
router.post('/login',  userController.loginUser)
router.get('/logout', userController.logoutUser)
        
        
        // User Signup

router.get('/signup', userController.viewSignup)
router.post('/signup', userController.signupUser)

        // Otp Login    

router.post('/otp-login', userController.getOtp)
router.post('/otp-confirm', userController.verifyOtp)

        // Shpping Cart
        
router.get('/add-to-cart/:id', userController.verifyLogin, addToCart)
router.get('/cart',userController.verifyLogin, viewCart)

router.post('/change-product-quantity', userController.verifyLogin, changeCartQuantity)
router.post('/remove-cart-item', userController.verifyLogin, removeCartItem)

        // Place Order

router.get('/place-order', userController.verifyLogin, checkOutOrder)
router.post('/place-order', userController.verifyLogin, placeOrder)
router.post('/coupon-apply', userController.verifyLogin, applyCoupon )

router.get('/order-success', userController.verifyLogin, orderSuccess)
router.get('/orders', userController.verifyLogin, ordersList)
router.post('/cancel-order', userController.verifyLogin, cancelOrder)
router.get('/return-order/:id', userController.verifyLogin, returnOrder)

router.get('/view-order-products/:id', userController.verifyLogin, viewOrderdproducts)

// <---------------------WishList------------------------------------------>
router.get('/wishlist', userController.verifyLogin, wishlistView)
router.get('/add-to-wishlist/:id', userController.verifyLogin, addtoWishlist)
router.get('/remove-form-wishlist/:id', userController.verifyLogin, removeFromWishtlist)


// <---------------------Razorpay------------------------------------------>

router.post('/verify-payment', userController.verifyLogin, verifyRazorpayPayment)

// <---------------------My Account------------------------------------------>

router.get('/my-account', userController.verifyLogin, userController.viewMyAccount)
router.post('/add-address', userController.verifyLogin, userController.addUserAddress)
router.post('/delete-address',userController.verifyLogin, userController.deleteUserAddress)
router.post('/edit-user-details', userController.verifyLogin, userController.editUserDetails)
router.post('/change-password', userController.verifyLogin, userController.changeUserPassword)


router.get('/wallet-history', userController.verifyLogin, userController.viewWalletHistory)
router.get('/invoice/:id', viewInvoice)

router.get('/about',userController.viewAboutPage)
router.get('/contact', userController.viewContactPage)
module.exports = {
    routes: router
}