const CategoryOffer = require("../models/categoryOfferModel");
const Product = require('../models/productMdoel')
const moment = require('moment');


const getAllCategoryOffers = () => {
    return new Promise((resolve, reject) => {
        CategoryOffer.find().then((offers) => {
           resolve(offers)
       })
    })
}

const addCategoryOffer = (offer) => {
    return new Promise(async(resolve, reject) => {
        const category = await CategoryOffer.findOne({ category: offer.category })
        if (category) {
            reject('Offer Exist')
        } else {
            const expiry = moment(offer.expiry).format("YYYY-MM-DD");
            const starting = moment(offer.starting).format("YYYY-MM-DD");
            const newOffer = new CategoryOffer({
                    category: offer.category,
                    startDate: starting,
                    endDate: expiry,
                    offer: parseInt(offer.percentage)
            })
            newOffer.save().then(() => {
                resolve()
            }).catch(() => {
                reject('Something Wrong!! Try Again')
            })
        }
    })
}


const catergoryOfferDelete = (offerId) => {
    return new Promise((resolve, reject) => {
        CategoryOffer.findByIdAndDelete(offerId).then(async(offer) => {
            const products = await Product.find({ category: offer.category, categOffer: true })
            if (products) {
                products.map((product) => {
                    Product.findByIdAndUpdate(product._id, {
                        $set: {
                        price: product.actualPrice,
                        categOffer: false
                        }
                    }).then(() => {
                        resolve()
                    })
                })
            }
            resolve()
        })
    })
}


const getOneCategoryOffer = (offerId) => {
    return new Promise((resolve, reject) => {
        CategoryOffer.findById(offerId).then((response) => {
            resolve(response)
        }) 
    })  
}

const catergoryOfferEdit = (offer) => {
    return new Promise(async(resolve, reject) => {
            const expiry = moment(offer.expiry).format("YYYY-MM-DD");
            const starting = moment(offer.starting).format("YYYY-MM-DD");
            CategoryOffer.findByIdAndUpdate(offer.id, {
                $set: {
                    category: offer.category,
                    startDate: starting,
                    endDate: expiry,
                    offer: offer.percentage
                }
            }).then(async() => {
                const products = await Product.find({ category: offer.category, categOffer: true })
                if (products) {
                    products.map((product) => {
                        Product.findByIdAndUpdate(product._id, {
                            $set: {
                                price: product.actualPrice,
                                categOffer: false
                            }
                        }).then(() => {
                            resolve()
                        })
                    }) 
                }
                resolve()
            }).catch(() => {
                reject('Something Wrong!!! Try Again...')
            })
        
    })
}



const startCategoryOffer = () => {
    return new Promise((resolve, reject) => {
        const today = new Date()
        CategoryOffer.find().then((response) => {
            const offers = response.filter((offer) => {
                if (moment(today).isSameOrAfter(offer.startDate) && moment(today).isSameOrBefore(offer.endDate)) {
                    return offer;
                }
            });
            offers.map(async (offer) => {
                const products = await Product.find({ category: offer.category, categOffer: false, proOffer: false });
                if (products) {
                    products.map(async (product) => {
                        const actualPrice = parseInt(product.price);
                        const newPrice = (actualPrice * offer.offer) / 100;
                        const offerPrice = newPrice.toFixed();
                        Product.findByIdAndUpdate(product._id, {
                            $set: {
                            categOffer: true,
                            price: actualPrice - offerPrice,
                            actualPrice: actualPrice,
                            offerPercentage: offer.offer
                            }
                        }).then(() => {
                            
                        });
                    });
                }
                resolve();
            });
        })
        resolve()
    })
}

module.exports = {
    getAllCategoryOffers, addCategoryOffer, catergoryOfferDelete, getOneCategoryOffer,
    catergoryOfferEdit, startCategoryOffer
}