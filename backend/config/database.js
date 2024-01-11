require("dotenv").config()

const { MONGO_DB } = require("./config")


module.exports = {
    database: MONGO_DB ,//'mongodb+srv://luminousbinary:luminousbinary@cluster0.zf0qy.mongodb.net/e-commerce?authSource=admin&replicaSet=atlas-tnwahg-shard-0&w=majority&readPreference=primary&appname=MongoDB%20Compass&retryWrites=true&ssl=true'
} 