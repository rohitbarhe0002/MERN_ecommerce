const cryptoJs = require("crypto-js");
const Product = require("../models/Product");
const Cart = require("../models/Cart");
const key = 'rohit@';
const verifyTokenAndAuthorization = require("./verifyTokens")
const verifyTokenAndAdmin = require("./verifyTokens")
const verifyToken = require("./verifyTokens")

const router = require('express').Router();

////create cart localhost:5000/api/productt and token of  admin//
router.post("/", verifyToken, async (req, res) => {
    const newCart = new Cart (req.body);
    try {

        const saveCart = await newCart.save();
        res.status(200).json(saveCart);

    } catch (err) {
        console.log(err);
    }
})
//update admin token and id of user which want to update  //
router.put("/:id", verifyToken, async (req, res) => {


    try {
        console.log("jjjj");
        console.log(req.params.id);
        const updatedCart = await Cart.findByIdAndUpdate(req.params.id, {
            $set: req.body

        }, { new: true })
        res.status(200).json(updatedCart)
        console.log(updatedCart);
    }
    catch (err) {
        res.status(500).json(err)
    }
})

//delete/ cart//
router.delete("/:id", verifyToken, async (req, res) => {
    try {
        await Cart.findByIdAndDelete(req.params.id)
        res.status(200).json("user cart has been deeleted")

    } catch (err) {
        res.status(500).json(err)
    }
})

//Get cart  localhost:5000/api/product/find/:user id and put bearer token of admin    /// 
router.get("/find/:userId", verifyTokenAndAuthorization, async (req, res) => {
    try {
        const cart = await Cart.findOne({userId:req.params.userId})

        res.status(200).json(cart)

    } catch (err) {
        res.status(500).json(err)
    }
})


//Get all product  localhost:5000/api/user/  put bearer token of admin and nothing in body/// 
// router.get("/",verifyTokenAndAdmin,async (req,res)=> {

//     try {
//       const users =  await User.find()

//         res.status(200).json(users)

//     }catch(err) {
//         res.status(500).json(err)
//     }
// })


//Get all user localhost:5000/api/product/ put bearer token of admin and nothing in body/// 
router.get("/", verifyTokenAndAdmin, async (req, res) => {
  try{
      const carts = await  Cart.find()
      res.status(200).json(carts)
    }catch (err) {
        res.status(500).json(err)

    }
})


module.exports = router;
