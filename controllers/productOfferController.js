const { getAllProduct } = require('../helpers/productHelper')
const {
    getAllproductOffers, addProductOffer, productOfferDelete, getOneProductOffer,
    productOfferEdit
} = require('../helpers/productOfferHelpers')



const viewAllProductOffers = (req, res) => {
    getAllproductOffers().then((offers) => {
        res.locals.user = req.user
        res.render('admin/productOffer', {offers})
    })
}

const viewAddProductOffer = (req, res) => {
    getAllProduct().then((products) => {
        res.locals.user = req.user
        res.render('admin/addProductOffer', {products, message: req.flash('message')})
    })
}

const addNewProductOffer = (req, res) => {
    addProductOffer(req.body).then(() => {
        res.redirect('/admin/product-offers')
    }).catch((error) => {
        req.flash('message', error)
        res.redirect('/admin/add-product-offer')
    })
}

const deleteProductOffer = (req, res) => {
    const offerId = req.params.id
    productOfferDelete(offerId).then(() => {
        res.redirect('/admin/product-offers')
    })
}
const veiwEditProductOffer = (req, res) => {
    const offerId = req.params.id
    getOneProductOffer(offerId).then((offer) => {
        res.locals.user = req.user
        res.render('admin/editProductOffer',{offer, message: req.flash('message')})
    })
}

const editProductOffer = (req, res) => {
    productOfferEdit(req.body).then(() => {
        res.redirect('/admin/product-offers')
    }).catch((error) => {
        req.flash('message', error)
        res.redirect('/admin/edit-product-offer/'+req.body.id)
    })
}


module.exports = {
    viewAllProductOffers, viewAddProductOffer, addNewProductOffer, deleteProductOffer,
    veiwEditProductOffer, editProductOffer
}