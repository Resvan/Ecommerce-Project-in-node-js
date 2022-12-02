const Product = require('../models/productMdoel')



module.exports = {
    getAllProduct: () => {
        return new Promise(async(resolve, reject) => {
            let products = await Product.find()
            resolve(products)
        })
    },
    getProductHome: () => {
        return new Promise(async(resolve, reject) => {
            const products = await Product.find().sort({"_id":-1}).limit(16)
            resolve(products)
        })
    },
    getOneProduct: (proId) => {
        return new Promise(async (resolve, reject) => {
            let product = await Product.findOne({_id: Object(proId)})
            resolve(product)
        })
    },
    
    



    addProduct: (images, proData) => {
        return new Promise(async(resolve, reject) => {
            let oldProduct = await Product.findOne({name: proData.name})
            let response = {}
            if (oldProduct) {
                response.status = false
                response.message = "Product already exists"
                resolve(response)
            } else {
                let stockObj = {
                    S: parseInt(proData.S),
                    M: parseInt(proData.M),
                    L: parseInt(proData.L),
                    XL: parseInt(proData.XL),
                    XXL: parseInt(proData.XXL),

                }
                let product = new Product
                product.name = proData.name
                product.category = proData.category
                product.price = proData.price
                product.stock = stockObj
                product.description = proData.description
                product.image1 = images[0].filename
                product.image2 = images[1].filename
                product.image3 = images[2].filename
                product.image4 = images[3].filename
                product.actualPrice = parseInt(proData.price)
                product.proOffer = false
                product.categOffer = false
                await product.save() 
                response.status = true
                resolve(response)
            }
            

        })
    },
    
    getEditProduct: (proId) => {
        return new Promise(async(resolve, reject) => {
            let product = await Product.findOne({ _id: Object(proId) })
            resolve(product)
        })
    },

    productEdit: (images, proData) => {
        return new Promise(async (resolve, reject) => {
            let product = await Product.findOne({ name: proData.name })
            let response = {}
            if (product) {
                response.error = "Product Exists"
                reject(response)
            } else {
                let stockObj = {
                    S: proData.S,
                    M: proData.M,
                    L: proData.L,
                    XL: proData.XL,
                    XXL: proData.XXL,

                }
                await Product.findByIdAndUpdate(proData.id, {
                    name: proData.name,
                    category: proData.category,
                    price: proData.price,
                    stock: stockObj,
                    image1: images.image1?.[0].filename,
                    image2: images.image2?.[0].filename,
                    image3: images.image3?.[0].filename,
                    image4: images.image4?.[0].filename,
                    description: proData.description,
                    actualPrice : parseInt(proData.price)
                })
                
                resolve(response)
            }
        })
    },

    

    deleteProduct: (proId) => {
        return new Promise(async(resolve, reject) => {
            await Product.deleteOne({ _id: Object(proId) }).then((response) => {
                resolve()
            })
        })
    }
}



