const { getAllCategory } = require('../helpers/adminhelpers')
const {
    getAllCategoryOffers, addCategoryOffer, catergoryOfferDelete, getOneCategoryOffer,
    catergoryOfferEdit
} = require('../helpers/categoryOfferHelper')


const viewAllCategoryOffers = (req, res) => {
    getAllCategoryOffers().then((offers) => {
        res.locals.user = req.user
        res.render('admin/categoryOffer',{offers})
    })
}

const viewAddCategoryOffer = (req, res) => {
    getAllCategory().then((categories) => {
        res.locals.user = req.user
        res.render('admin/addCategoryOffer', {categories, message: req.flash('message')})
    })
}

const addNewCategoryOffer = (req, res) => {
    addCategoryOffer(req.body).then(() => {
        res.redirect('/admin/category-offers')
    }).catch((error) => {
        req.flash('message', error)
        res.redirect('/admin/add-category-offer')
    })
}

const deleteCategoryOffer = (req, res) => {
    const offerId = req.params.id
    catergoryOfferDelete(offerId).then(() => {
        res.redirect('/admin/category-offers')
    })
}

const viewEditCategoryOffer = (req, res) => {
    const offerId = req.params.id
    getOneCategoryOffer(offerId).then((offer) => {
        res.locals.user = req.user
        res.render('admin/editCategoryOffer',{offer, message: req.flash('message')})
    })
}


const editCategoryOffer = (req, res) => {
    const id = req.body.id
    catergoryOfferEdit(req.body).then(() => {
        res.redirect('/admin/category-offers')
    }).catch((error) => {
        req.flash('message', error)
        res.redirect('/admin/edit-category-offer/'+id)
    })
}



module.exports = {
    viewAllCategoryOffers, viewAddCategoryOffer, addNewCategoryOffer, deleteCategoryOffer, viewEditCategoryOffer,
    editCategoryOffer
}