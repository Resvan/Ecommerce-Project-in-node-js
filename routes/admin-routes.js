const express = require('express')
const router = express.Router()
const adminController = require('../controllers/adminController')
const productController = require('../controllers/productController')
const { ordersView, changeOrderStatus, vieworderedProducts
        } = require('../controllers/orderController')

const { viewAllCoupons, viewAddCoupon, addNewCoupon, viewEditcoupon, editCouponDetails,
        deleteCoupon
} = require('../controllers/couponController')

const { viewAllCategoryOffers, viewAddCategoryOffer, addNewCategoryOffer, deleteCategoryOffer,
    viewEditCategoryOffer, editCategoryOffer
} = require('../controllers/categoryOfferController')
const {
    viewAllProductOffers, viewAddProductOffer, addNewProductOffer, deleteProductOffer,
    veiwEditProductOffer, editProductOffer
} = require('../controllers/productOfferController')

const {viewSalesManagement} = require('../controllers/salesManagementController')

//setting layout for admin side seperate...
const setAdminLayout = (req, res, next) => {
    res.locals.layout = 'layouts/adminLayout'
    next()
}
//using admin layout...
router.use(setAdminLayout)




router.get('/login', adminController.checkNotAuthenticated, adminController.viewLogin)
router.post('/login', adminController.loginAdmin)

router.get('/', adminController.checkAuthenticated, adminController.dashboardView)
router.get('/chart-data', adminController.checkAuthenticated, adminController.getDataForChart)


router.get('/logout', adminController.checkAuthenticated,  adminController.logoutAdmin)
router.get('/users', adminController.checkAuthenticated,   adminController.usersView)
router.get('/category', adminController.checkAuthenticated, adminController.categoryView)
router.get('/block/:id', adminController.checkAuthenticated, adminController.blockUser)
router.get('/unblock/:id', adminController.checkAuthenticated, adminController.unblockUser)
router.get('/add-category', adminController.checkAuthenticated,  adminController.viewAddCateogry)
router.get('/edit-category/:id', adminController.checkAuthenticated, adminController.vieweditCategory)
router.get('/delete-category/:id', adminController.checkAuthenticated,  adminController.deleteCategory)




router.post('/add-category', adminController.checkAuthenticated,  adminController.addCategory)
router.post('/edit-category', adminController.checkAuthenticated, adminController.editCategory)



router.get('/products', adminController.checkAuthenticated, productController.allProductsView)
router.get('/add-product', adminController.checkAuthenticated, productController.addProductView)

router.get('/delete-product/:id', adminController.checkAuthenticated, productController.deleteProduct)

router.get('/edit-product/:id', adminController.checkAuthenticated, productController.editProductView)

router.post('/add-product', adminController.checkAuthenticated, productController.uploadImage.array('image', 4), productController.productAdd)
router.post('/edit-product', productController.uploadMultipleFiled, productController.editProduct )


router.get('/orders', adminController.checkAuthenticated, ordersView)
router.get('/view-order-products/:id', adminController.checkAuthenticated, vieworderedProducts )
router.post('/change-order-status', adminController.checkAuthenticated, changeOrderStatus)

router.get('/coupons', adminController.checkAuthenticated, viewAllCoupons)
router.get('/add-coupon', adminController.checkAuthenticated, viewAddCoupon)
router.post('/add-coupon', adminController.checkAuthenticated,addNewCoupon)
router.get('/edit-coupon/:id', adminController.checkAuthenticated, viewEditcoupon)
router.post('/edit-coupon', adminController.checkAuthenticated, editCouponDetails)
router.get('/delete-coupon/:id', adminController.checkAuthenticated, deleteCoupon)

router.get('/category-offers', adminController.checkAuthenticated, viewAllCategoryOffers)
router.get('/add-category-offer', adminController.checkAuthenticated, viewAddCategoryOffer)
router.post('/add-category-offer', adminController.checkAuthenticated, addNewCategoryOffer)
router.get('/delete-category-offer/:id', adminController.checkAuthenticated, deleteCategoryOffer)
router.get('/edit-category-offer/:id', adminController.checkAuthenticated, viewEditCategoryOffer)
router.post('/edit-category-offer', adminController.checkAuthenticated, editCategoryOffer)

router.get('/product-offers', adminController.checkAuthenticated, viewAllProductOffers)
router.get('/add-product-offer', adminController.checkAuthenticated, viewAddProductOffer)
router.post('/add-product-offer', adminController.checkAuthenticated, addNewProductOffer)
router.get('/delete-product-offer/:id', adminController.checkAuthenticated, deleteProductOffer)
router.get('/edit-product-offer/:id', adminController.checkAuthenticated, veiwEditProductOffer)
router.post('/edit-product-offer', adminController.checkAuthenticated, editProductOffer)


router.get('/sale-report',viewSalesManagement)

module.exports = {
    routes: router
}