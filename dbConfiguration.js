const mongoose = require('mongoose') ;
const colors = require('colors') ;
const dotenv = require('dotenv') ;

dotenv.config() ;

const dbConnection = async() => {
    try {
        await mongoose.connect(process.env.mongodb_uri) ;
        console.log(`Successfully connected to database`.bgGreen) ;
    }
    catch(error){
        console.log(`Unable to connect to database due to error ${error}`.bgRed) ;
    }
}

module.exports = dbConnection ;