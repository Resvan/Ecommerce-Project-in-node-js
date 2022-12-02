const mongoose = require('mongoose')



const connectDB = async () => {
    const conn = await mongoose
        .connect(process.env.MONGO_URI
)
        .then(() => console.log("e don connect"))
        .catch((err) => console.log(err));
}



module.exports = connectDB

