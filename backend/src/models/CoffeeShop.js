import mongoose from "mongoose";

const CoffeeShopSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Coffee Shop Name is Required"],
        trim: true
    },
    location: {
        type: String,
        required: [true, "Location of shop is required"],
        trim: true
    },
    imageURL: {
        type: String,
        default: ''
    },
    description: {
        type: String,
        default: '',
        maxLength: [500, 'Description is capped at 500 characters'] 
    }
}, {timestamps: true});

const CoffeeShop = mongoose.model("Coffee Shop", CoffeeShopSchema);

export default CoffeeShop;