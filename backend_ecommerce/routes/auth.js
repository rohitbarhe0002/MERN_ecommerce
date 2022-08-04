const router = require('express').Router();
const User = require("../models/User");
const jwt = require("jsonwebtoken")
const cryptojs = require("crypto-js")
const key = 'rohit@';
const JWT_SEC= 'rohitbarche';
////register//
router.post("/register", async (req,res)=> {
  console.log("comming for register");
    const newUser = new User({
        username : req.body.username,
         email : req.body.email,
         isAdmin:req.body.isAdmin,
        password : cryptojs.AES.encrypt( req.body.password,key).toString()
    })
    
    try{
   const savedUser =  await  newUser.save();
   res.status(201).json(savedUser)
   console.log(savedUser);
    }catch(err){
        res.status(500).json(err)
           
    }
})

///login  //
 router.post("/login",async (req,res)=>{
     try {
       
         const user = await User.findOne({username:req.body.username})
         !user && res.status(401).json('!wrong credentials')
         const hasPassword = cryptojs.AES.decrypt(user.password,key)
         const originalPassword = hasPassword.toString(cryptojs.enc.Utf8)
         originalPassword!== req.body.password && res.status(401).json('!wrong  from 2 credentials');
         const accsessToken = jwt.sign({
             id:user._id,
             isAdmin:user.isAdmin,
         },JWT_SEC, 
         {expiresIn:"3d"})

         const {password, ...others} = user._doc
         
         res.status(200).json({...others,accsessToken})
     } 
     catch(err) {
         res.status(400).json(err)
     }

 })
module.exports =  router;
