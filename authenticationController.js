const userAuthModel = require('./userModel') ;
const jwt = require('jsonwebtoken') ;
const dotenv = require('dotenv') ;

dotenv.config() ;
const handleUserRegister = async(req,res) => {
   
    const {userName,userEmail,userPassword} = req.body ;
     if((!userName) || (!userEmail) || (!userPassword)) {
           return res.status(400).send({message:'Entering all field is mandatory',success:false}) ;
     }
     try {
          let regResponse = await userAuthModel.findOne({userEmail:req.body.userEmail}) ;
          if(regResponse) {
               return res.status(409).send({message:'User already exists',success:false}) ;
          }
          else {
               const salt = await bcryptjs.genSalt(10) ; 
               const password = req.body.userPassword ;
               const hashedPassword =  await bcryptjs.hash(password,salt) ;
               const newResponse = await new registerModel({userName,userEmail,userPassword:hashedPassword}) ;
               const savedUser = await newResponse.save({userName,userEmail,userPassword:hashedPassword}) ;  
               const userDetails = {
                   userName:savedUser.userName,
                   userEmail:savedUser.userEmail
               }
               console.log(userDetails) ; 
               return res.status(201).send({message:'Successfully done the registration',success:true,userDetails}) ;         
          }
     }
     catch(error){
             console.log(error) ;
             return res.status(500).send({message:'Could not process the request',success:false}) ;
     }
  
 }
 
 const handleUserLogin = async(req,res) => {
     const {userEmail,userPassword} = req.body ;
     console.log(req.body) ;
     if((!userEmail) || (!userPassword)) {
          {
             return res.status(400).send({message:'Entering all fields is mandatory',success:false}) ; 
          }
     }
     try {
           let comparisonOutput ;
           let loginResponse = await userAuthModel.findOne({userEmail:req.body.userEmail}) ;
           if(!loginResponse) {
              return res.status(404).send({message:'Invalid email',success:false}) ;
           }
           else if(!loginResponse.userPassword){
              return res.status(405).send({message:'Invalid user',success:false}) ;  
           }
           const userDetails = {
                userEmail: loginResponse.userEmail
           }
           console.log(userDetails) ;
           comparisonOutput = await bcryptjs.compare(userPassword,loginResponse.userPassword) ;
           if(!comparisonOutput){
               return res.status(406).send({message:'Invalid credentials',success:false}) 
           }
           else {
             const token = jwt.sign({id:comparisonOutput._id},process.env.secret_key,{
                 expiresIn:"1d"
             }) 
               return res.status(201).send({message:'Login successfull',success:true,token}) ;
           }
     }
     catch(error) {
          console.log(error) ;
          return res.status(500).send({message:'Unable to process the request',success:false}) ;
     }
 }

const express = require('express') ;
const registerRouter = express.Router() ;
const loginRouter = express.Router() ;

registerRouter.post('/register-user',handleUserRegister) ;
loginRouter.post('/login-user',handleUserLogin) ;

module.exports = {
    registerRouter:registerRouter ,
    loginRouter:loginRouter
}