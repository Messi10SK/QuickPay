const mongoose = require("mongoose")
const dotenv = require("dotenv")

dotenv.config()

const connectToDb = function() {
    try {
        mongoose.connect(process.env.MONGOURI)
        .then(()=>{
            console.log("connected to db")
        })
    } catch (error) {
        console.log("error connecting to database")
    }
}

module.exports = connectToDb;