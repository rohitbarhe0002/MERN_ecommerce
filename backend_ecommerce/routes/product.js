const cryptoJs = require("crypto-js");
const Product = require("../models/Product");
const multer = require("multer");
const path = require("path")
const key = 'rohit@';
const verifyTokenAndAuthorization = require("./verifyTokens")
const verifyTokenAndAdmin = require("./verifyTokens")
// require('../upload')
const router = require('express').Router();


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, '../upload/')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + 'img' + Math.round(Math.random() * 1E9)
      cb(null, file.fieldname + '-' + uniqueSuffix)
    }
  })
  const upload = multer({ storage: storage })

/////////upload with images//
// const upload = multer({
//     dest:'../upload/'
// })





////create product localhost:5000/api/productt and token of  admin//
router.post("/",upload.single('img') , verifyTokenAndAdmin, async (req, res) => {
    // req.body.img = req.file.path;
    const newProduct = new Product(req.body);
    try {
        const saveProduct = await newProduct.save();
        res.status(200).json(saveProduct);
console.log(saveProduct,"===================saved product");
    } catch (err) {
        console.log("comming here");
        res.status(500).json(err)
    }
})
//update admin token and id of user which want to update  //
router.put("/:id", verifyTokenAndAdmin, async (req, res) => {


    try {
        console.log("jjjj");
        console.log(req.params.id);
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, {
            $set: req.body

        }, { new: true })
        res.status(200).json(updatedUser)
        console.log(updatedUser);
    }
    catch (err) {
        res.status(500).json(err)
    }
})

//delete/ user//
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id)
        res.status(200).json("user has been deeleted")

    } catch (err) {
        res.status(500).json(err)
    }
})

//Get Product  localhost:5000/api/product/find/:user id and put bearer token of admin    /// 
router.get("/find/:id", async (req, res) => {
    
    try {
        const product = await Product.findById(req.params.id)

        res.status(200).json(product)
console.log(product,"=====================product");
    } catch (err) {
        res.status(500).json(err)
    }
})


// Get all product  localhost:5000/api/user/  put bearer token of admin and nothing in body/// 
// router.get("/",verifyTokenAndAdmin,async (req,res)=> {

//     try {
//       const products =  await Product.find()

//         res.status(200).json(products)

//     }catch(err) {
//         res.status(500).json(err)
//     }
// })


//Get all user localhost:5000/api/product/ put bearer token of admin and nothing in body/// 

router.get("/", verifyTokenAndAdmin, async (req, res) => {
    const qnew = req.query.new;
    const qcatogory = req.query.catogory;
    const qprice = req.query.price;
    console.log(qprice,"===");
    try {
        let products;

        if (qnew) {
            products = await Product.find().sort({ createdAt: -1 }).limit(1)
        }
        else if (qcatogory) {
            products = await Product.find({
                catogories: {
                    $in: [qcatogory],

                },
            })
        }

        else if (qprice) {
            console.log(qprice,"====qprice");
            products = await Product.find({
                price: {
                    $in: [qprice],

                },
            })
        }

        else {
            products = await Product.find();
        }
        res.status(200).json(products)
    }catch (err) {
        res.status(500).json(err)

    }
})


//  eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyYzdlZWNjNzEyYWJkMWMxMzc3MjU3NiIsImlzQWRtaW4iOmZhbHNlLCJpYXQiOjE2NTcyNjk5OTUsImV4cCI6MTY1NzUyOTE5NX0.I52UnjMkF-dQuJnisEFBCPXAAvndHWJHkRM-ePok-J8


module.exports = router;
