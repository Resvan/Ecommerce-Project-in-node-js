const ProductOffer = require("../models/productOfferModel")
const Product = require('../models/productMdoel')
const moment = require('moment')




const getAllproductOffers = () => {
    return new Promise((resolve, reject) => {
        ProductOffer.find().then((offers) => {
            resolve(offers)
        })
    })
}

const addProductOffer = (data) => {
    return new Promise(async(resolve, reject) => {
        const productOffer = await ProductOffer.findOne({ product: data.product })
        if (productOffer) {
            reject('Offer Exist for this product')
        } else {
            const expiry = moment(data.expiry).format("YYYY-MM-DD");
            const starting = moment(data.starting).format("YYYY-MM-DD");
            const newOffer = new ProductOffer({
                product: data.product,
                startDate: starting,
                endDate: expiry,
                offer: data.percentage
            })
            newOffer.save().then(() => {
                resolve()
            }).catch(() => {
                reject('Something Wrong! Try Later..')
            })
        }
    })
}

const productOfferDelete = (offerId) => {
    return new Promise((resolve, reject) => {
        ProductOffer.findByIdAndDelete(offerId).then(async(offer) => {
            const product = await Product.findOne({ name: offer.product, proOffer: true })
            if (product) {
                Product.findByIdAndUpdate(product._id, {
                    $set: {
                        price: product.actualPrice,
                        proOffer: false
                    }
                }).then(() => {
                    resolve()
                })
            }
            resolve()
        })
    })
}

const getOneProductOffer = (offerId) => {
    return new Promise((resolve, reject) => {
        ProductOffer.findById(offerId).then((offer) => {
            resolve(offer)
        })
    })
}

const productOfferEdit = (offerData) => {
    return new Promise(async(resolve, reject) => {
            const expiry = moment(offerData.expiry).format("YYYY-MM-DD");
            const starting = moment(offerData.starting).format("YYYY-MM-DD");
            ProductOffer.findByIdAndUpdate(offerData.id, {
                product: offerData.product,
                startDate: starting,
                endDate: expiry,
                offer: offerData.percentage
            }).then(async() => {
                const product = await Product.findOne({ name: offerData.product, proOffer: true })
                if (product) {
                    Product.findByIdAndUpdate(product._id, {
                        $set: {
                            price: product.actualPrice,
                            proOffer: false
                        }
                    }).then(() => {
                        resolve() 
                    })
                }
                resolve()
            }).catch(() => {
                reject('Try later!!')
            })
    })
}
//<----------------------------------------------------------------------------->
//<----------------------------USER--------------------------------------------->
//<----------------------------------------------------------------------------->
 

const startProductOffer = async () => {
    try {
        const today = new Date();
        const offers = await ProductOffer.find({
            startDate: { $lte: today },
            endDate: { $gte: today }
        });
        for (const offer of offers) {
            const product = await Product.findOne({
                name: offer.product,
                proOffer: false,
                categOffer: false
            });

            if (product) {
                const actualPrice = parseInt(product.price);
                const newPrice = (actualPrice * offer.offer) / 100;
                const offerPrice = newPrice.toFixed();

                await Product.findByIdAndUpdate(product._id, {
                    $set: {
                        proOffer: true,
                        price: actualPrice - offerPrice,
                        actualPrice: actualPrice,
                        offerPercentage: offer.offer
                    }
                });
            }
        }

        console.log("Product offers updated successfully");
    } catch (error) {
        console.error("Error in updating product offers:", error);
    }
};





module.exports = {
    getAllproductOffers, addProductOffer, productOfferDelete, getOneProductOffer,
    productOfferEdit, startProductOffer
}