const CategoryOffer = require("../models/categoryOfferModel");
const Product = require("../models/productMdoel");
const ProductOffer = require("../models/productOfferModel");

const updateOfferExpireForProduct = async () => {
  try {
    const today = new Date();
    const expiredOffers = await ProductOffer.find({
      endDate: { $lt: today },
    });

    for (const offer of expiredOffers) {
      const product = await Product.findOne({ name: offer.product });
      const updatedPro = await Product.findByIdAndUpdate(product._id, {
        $set: {
          proOffer: false,
          price: product.actualPrice,
          actualPrice: product.actualPrice,
          offerPercentage: 0,
        },
      });
    }

    return expiredOffers;
  } catch (error) {
    console.error("Error in updating product offers:", error);
    throw error;
  }
};

const updateCatgoryOfferExpireForProduct = async () => {
    try {
        const today = new Date();
        const expiredOffers = await CategoryOffer.find({
            endDate: { $lt: today },
        });

        for (const offer of expiredOffers) {
            const categoryId = offer.category;

            // Fetch all products in the category
            const products = await Product.find({ category: categoryId });

            // Update each product individually
            for (const product of products) {
                const updatedPro = await Product.findByIdAndUpdate(product._id, {
                    $set: {
                        categOffer: false,
                        price: product.actualPrice,
                        actualPrice: product.actualPrice,
                        offerPercentage: 0,
                    },
                });
            }
        }

        return expiredOffers;
    } catch (error) {
        console.error("Error in updating product offers:", error);
        throw error;
    }
};

module.exports = {
    updateOfferExpireForProduct, updateCatgoryOfferExpireForProduct
};
