const productHelper = require('../helpers/productHelper')
const multer = require('multer')
const adminHelper = require('../helpers/adminhelpers')
const { getCartCount, productExistInCart } = require('../helpers/cartHelpers')


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/product')
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname)
    }
})
const filefilter = (req, file, cb) => {
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
        cb(null, true)
    } else {
        cb(null, false)
    }
}

const uploadImage = multer({ storage: storage, fileFilter: filefilter })
const uploadMultipleFiled = uploadImage.fields([{name:'image1', maxCount:1}, {name:'image2',maxCount:1},{name:'image3',maxCount:1},{name:'image4',maxCount:1}])



module.exports = {
// <------------------------Admin----------------------------->
// <----------------------------------------------------------->    

   allProductsView: (req, res) => {
        productHelper.getAllProduct().then((products) => {
            res.render('admin/products',{products, message: req.flash('message')})
        })
        
    },

    addProductView: (req, res) => {
        adminHelper.getAllCategory().then((category) => {
            res.render('admin/addProduct',{category, message: req.flash('message')})
        })
        
    },

    productAdd: (req, res) => {
        productHelper.addProduct(req.files, req.body).then((response) => {
            if (response.status) {
                res.redirect('/admin/products')
            } else {
                req.flash('message', response.error)
                res.redirect('/admin/add-product')
            }
        })
        
        
    },


    editProductView:async (req, res) => {
        let proId = req.params.id
        let category = await adminHelper.getAllCategory()
         productHelper.getOneProduct(proId).then((product) => {
            res.render('admin/editProduct', { product, category, message: req.flash('message') })
         })
    },

    editProduct: (req, res) => {
        let proData = req.body
        let images = req.files
        let id = proData.id
        productHelper.productEdit(images, proData).then(() => {
            res.redirect('/admin/products')
        }).catch((response) => {
            req.flash('message', response.error)
            res.redirect('/admin/edit-product/'+id)
        })
    },


    deleteProduct: (req, res) => {
        proId = req.params.id
        productHelper.deleteProduct(proId).then(() => {
            res.redirect('/admin/products')
            req.flash('message', 'Product deleted successfully')
        })
    },




// <------------------------USER----------------------------->
// <----------------------------------------------------------->  


    uploadImage,

    uploadMultipleFiled,


    getProductView: (req, res) => {
        let proId = req.query.id
        productHelper.getOneProduct(proId).then(async(product) => {
            let cartCount = 0
            if (req.session.user) {
                userId = req.session.user._id
                cartCount = await getCartCount(userId)
                res.locals.cartCount = cartCount
                const proExist = await productExistInCart(userId, proId)
                res.locals.proExist = proExist.status
            }
            
            res.render('user/product-details', { product })
        })

    }
}