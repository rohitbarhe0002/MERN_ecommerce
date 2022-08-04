const mongoose = require('mongoose')

const OrderShema = new mongoose.Schema({
    userId: { type: String, required: true, unique: true },
    products: [{
        productName: {
            type: String,
        },
        productId: {
            type: String,
        },
        quantity: {
            type: Number,
            default: 1,
        }
    }],
    amount: { type: Number, required: true },
    address: { type: Object, required: true },
    status: { type: String, default: "pending" }

}, { timestamps: true })

module.exports = mongoose.model("Order", OrderShema)