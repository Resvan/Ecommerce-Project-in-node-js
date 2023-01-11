const { getTotalAmount,
} = require('../helpers/orderHelper')
const { addCoupon, getAllCoupons, getOneCoupon, couponEdit,
    couponDelete, validateCoupon
} = require('../helpers/couponHelpers')


const applyCoupon = async (req, res) => {
    let couponCode = req.body.coupon
    let userId = req.session.user._id
    let totalPrice = await getTotalAmount(userId);
    validateCoupon(couponCode, userId, totalPrice).then((response) => {
        req.session.couponTotal = response.total
        if (response.success) {
            res.json({ couponSuccess: true, total: response.total, discountValue: response.discountValue, couponCode })
        } else if (response.couponUsed) {
            res.json({ couponUsed: true })
        } else if (response.couponExpired) {
            res.json({ couponExpired: true })
        } else {
            res.json({ invalidCoupon: true })
        }

    })
}








//<-------------------------------------------------------------------------------->
//<--------------------------------ADMIN-------------------------------------------->
//<-------------------------------------------------------------------------------->

const viewAllCoupons = (req, res) => {
    getAllCoupons().then((allCoupons) => {
        res.locals.user = req.user
        res.render('admin/coupons',{allCoupons})
    }).catch(() => {
        res.redirect('/admin/add-coupon')
    })
    
}


const viewAddCoupon = (req, res) => {
    req.locals.user = req.user
    res.render('admin/addCoupon')
}

const addNewCoupon = (req, res) => {
    addCoupon(req.body).then(() => {
        res.redirect('/admin/coupons')
    }).catch(() => {
        res.redirect('/admin/add-coupon')
    })

}

const viewEditcoupon = (req, res) => {
    couponId = req.params.id
    getOneCoupon(couponId).then((coupon) => {
        res.locals.user = req.user
        res.render('admin/editCoupon',{coupon})
    }).catch(() => {
        res.redirect('/admin/coupons')
    })
}

const editCouponDetails = (req, res) => {
    couponEdit(req.body).then(() => {
        res.redirect('/admin/coupons')
    }).catch(() => {
        res.redirect('/admin/edit-coupon/'+req.body.id)
    })
}

const deleteCoupon = (req, res) => {
    const id = req.params.id
    couponDelete(id).then(() => [
        res.redirect('/admin/coupons')
    ]).catch(() => {
        res.redirect('/admin/coupons')
    })
}

module.exports = {
    viewAllCoupons, viewAddCoupon, applyCoupon, addNewCoupon, viewEditcoupon, editCouponDetails,
    deleteCoupon
}