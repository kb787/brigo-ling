const mongoose = require('mongoose') ;

const userAuthSchema = mongoose.Schema(
    {
        userName : {
            type:String ,
            unique:true 
        } ,
        userEmail: {
            type:String ,
            unique:true
        } ,
        userPassword : {
            type:String ,
            unique:true
        } 
    }
) 

let userAuthModel ;

if(mongoose.model.users) {
    userAuthModel = mongoose.model('users') ;
}

userAuthModel = mongoose.model('users',userAuthSchema) ;

module.exports = userAuthModel ;