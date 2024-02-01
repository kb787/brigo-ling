const userAuthModel = require('./userModel') ;
const jwt = require('jsonwebtoken') ;
const dotenv = require('dotenv') ;

dotenv.config() ;

const handleUserRegistration = async(req,res) => {
    const {userName,userEmail,userPassword} = req.body ;
    try {
        if((!userName) || (!userEmail) || (!userPassword)){
             return res.status(400).send('Entering all fields is mandatory') ;
        }
        else {
            const prevUser = await userAuthModel.find({userEmail}) ;
            if(prevUser){
                return res.status(400).send('User already exists') ;
            }
            const salt = await bcrypt.genSalt(10) ;
            const password = req.body.userPassword ;
            const hashedPassword = await bcrypt.hash(password,salt) ;
            const regUser = await new userAuthModel(
                {
                    email,hashedPassword
                }
            )
            regUser.save() ;
            const sendUser = {
                username:regUser.username ,
                email:regUser.email ,
            }
            return res.status(201).send({message:'Successfully saved new user',sendUser}) ;  
        }
           
    }
    catch(error){
            console.log(error) ;
            return res.status(500).send({message:'Unable to perform the request'}) ; 
    } 
}

const handleUserLogin = async(req,res) => {
         const {userEmail,userPassword} = req.body ;

         try {
             if((!userEmail) || (!userPassword)){
                 return res.status(400).send({message:'Entering all fields is mandatory'}) 
             }
             const prevUser = await userAuthModel.find({userEmail}) ;
             if(!prevUser){
                 return res.status(400).send({message:'Email not found'}) ;
             }
             let comparisonOutput ; 
             comparisonOutput = await bcrypt.compare(userPassword,prevUser.userPassword) ;
             if(comparisonOutput !== true){
                return res.status(400).send({message:'Invalid credentials'}) ;    
             }
             const token = jwt.sign({id:comparisonOutput._id},process.env.secret_key,{
                expiresIn:"1d"
             }) 
             return res.status(201).send({message:'Login sucessfull',success:true,token}) ;
 
         }
         catch(error){
             return res.status(500).send({message:'Unable to process the request'}) ;
         }
}

const express = require('express') ;
const registerRouter = express.Router() ;
const loginRouter = express.Router() ;

registerRouter.post('/register-user',handleUserRegistration) ;
loginRouter.post('/login-user',handleUserLogin) ;

module.exports = {
    registerRouter:registerRouter ,
    loginRouter:loginRouter
}