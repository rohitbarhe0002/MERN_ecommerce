const cryptoJs = require("crypto-js");
const Product = require("../models/Product");
const Order = require("../models/Order");

const key = 'rohit@';
const verifyTokenAndAuthorization = require("./verifyTokens")
const verifyTokenAndAdmin = require("./verifyTokens")
const verifyToken = require("./verifyTokens")

const router = require('express').Router();

////create cart localhost:5000/api/productt and token of  admin//
router.post("/", verifyToken, async (req, res) => {
    const newOrder = new Order(req.body);
    try {

        const saveOrder = await newOrder.save();
        res.status(200).json(saveOrder);

    } catch (err) {
        console.log(err);
    }
})
//update admin token and id of user which want to update  //
router.put("/:id", verifyTokenAndAdmin, async (req, res) => {


    try {
        console.log("jjjjffd  fgfg  ");
        console.log(req.params.id);
        const updatedOrder = await Order.findByIdAndUpdate(req.params.id, {
            $set: req.body

        }, { new: true })
        res.status(200).json(updatedOrder)
        console.log(updatedOrder);
    }
    catch (err) {
        res.status(500).json(err)
    }
})

//delete/ order//
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
    try {
        await Order.findByIdAndDelete(req.params.id)
        res.status(200).json("user  order hasddd been deeleted")

    } catch (err) {
        
        res.status(500).json(err)
    }
})

//Get cart  localhost:5000/api/product/find/:user id and put bearer token of admin    /// 
router.get("/find/:userId", verifyTokenAndAuthorization, async (req, res) => {
    try {
        const order = await Order.findOne({userId:req.params.userId})

        res.status(200).json(order)

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


//Get all orders localhost:5000/api/product/ put bearer token of admin and nothing in body/// 
router.get("/", verifyTokenAndAdmin, async (req, res) => {
  try{
      const orders = await  Order.find()
      res.status(200).json(orders)
    }catch (err) {
        res.status(500).json(err)

    }
})

////gett monthly income //
router.get("/income",verifyTokenAndAdmin,async(req,res)=> {
    const date = new Date();
    const lastmonth = new Date(date.setMonth(date.getMonth()-1))
    const previousMmonth =  new Date(new Date().setMonth(lastmonth.getMonth()-1))

    try {
        const income = await order.aggregate([
            {$month:{createdAt:{$gte: previousMmonth}}},
            {
                $project:{
                month:{$month:"$craetedAt"},
                sales:"$amount",
                },
            },
            {
                $group : {
                    _id:"$month",
                    total:{$sum:"$sales"}
                }
            }

        ])
res.send.json(income)
    }catch(err) {
        res.status(500).json(err)
    }
})


module.exports = router;
