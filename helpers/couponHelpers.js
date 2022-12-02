const Coupon = require('../models/couponModel')
const moment = require('moment')




const validateCoupon = (couponCode, userId, totalAmount) => {
    return new Promise(async (resolve, reject) => {
        obj = {}
        let date = new Date()
        let coupon = await Coupon.findOne({ name: couponCode })
        if (coupon) {
            let users = coupon.users
            let userCheck = users.includes(userId)
            if (userCheck) {
                obj.couponUsed = true
                resolve(obj)
            } else {
                if (moment(date).isSameOrBefore(coupon.endDate) && moment(date).isSameOrAfter(coupon.startDate)) {
                    let total = parseInt(totalAmount)
                    let percentage = parseInt(coupon.offer)
                    let discountValue = ((total * percentage) / 100).toFixed()

                    obj.total = total - discountValue
                    obj.success = true
                    obj.discountValue = discountValue
                    resolve(obj)
                } else {
                    obj.couponExpired = true
                    resolve(obj)
                }
            }
        } else {
            console.log("coupon invalid");
            obj.invalidCoupon = true
            resolve(obj)
        }
    })
}

//<-------------------------------------------------------------->
//<---------------------------ADMIN------------------------------>
//<-------------------------------------------------------------->


const addCoupon = (data) => {
    return new Promise(async (resolve, reject) => {
        let coupon = await Coupon.findOne({ name: data.name });
        if (coupon) {
            reject();
        } else {
            let expiry =  moment(data.expiry).format("YYYY-MM-DD");
            let starting =  moment(data.starting).format("YYYY-MM-DD");
            const newCoupon = new Coupon({
                    name: data.name,
                    offer: parseInt(data.couponPercentage),
                    startDate: starting,
                    endDate: expiry
                
            })
            newCoupon.save().then(() => {
               resolve()
            }).catch(() => {
               reject()
           })
        }
    });
}

const getAllCoupons = () => {
    return new Promise((resolve, reject) => {
        Coupon.find().then((allCoupons) => {
            resolve(allCoupons)
        }).catch(() => {
            reject()
        })
    })
}

const getOneCoupon = (couponId) => {
    return new Promise((resolve, reject) => {
        Coupon.findById(couponId).then((coupon) => {
            resolve(coupon)
        }).catch(() => {
            reject()
        })
    })
}


const couponEdit = (data) => {
    return new Promise((resolve, reject) => {
        let expiry = moment(data.expiry).format("YYYY-MM-DD");
        let starting = moment(data.starting).format("YYYY-MM-DD");
        Coupon.findByIdAndUpdate(data.id, {
                name: data.name,
                offer: parseInt(data.couponPercentage),
                startDate: expiry,
                endDate: starting
            
        }).then(() => {
            resolve()
        }).catch((response) => {
            reject()
        })
    })
}

const couponDelete = (couponId) => {
    return new Promise((resolve, reject) => {
        Coupon.findByIdAndDelete(couponId).then(() => {
            resolve()
        }).catch(() => {
            reject()
        })
    })
}

module.exports = {
    getAllCoupons, addCoupon, validateCoupon, getOneCoupon, couponEdit, couponDelete
}

