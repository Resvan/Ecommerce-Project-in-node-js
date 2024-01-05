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



const startCategoryOffer = async () => {
    try {
        const today = new Date();
        const categoryOffers = await CategoryOffer.find({
            startDate: { $lte: today },
            endDate: { $gte: today }
        });

        for (const offer of categoryOffers) {
            const products = await Product.find({
                category: offer.category,
                categOffer: false,
                proOffer: false
            });

            for (const product of products) {
                const actualPrice = parseInt(product.price);
                const newPrice = (actualPrice * offer.offer) / 100;
                const offerPrice = newPrice.toFixed();

                await Product.findByIdAndUpdate(product._id, {
                    $set: {
                        categOffer: true,
                        price: actualPrice - offerPrice,
                        actualPrice: actualPrice,
                        offerPercentage: offer.offer
                    }
                });
            }
        }

        console.log("Category offers updated successfully");
    } catch (error) {
        console.error("Error in updating category offers:", error);
        throw error;
    }
};

module.exports = {
    getAllCategoryOffers, addCategoryOffer, catergoryOfferDelete, getOneCategoryOffer,
    catergoryOfferEdit, startCategoryOffer
}