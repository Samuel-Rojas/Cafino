import mongoose, { mongo } from "mongoose";

const coffeeOrderSchema = mongoose.Schema({
    coffeeShop: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CoffeeShop',
        required: [true, 'Coffee shop is required']
    },
    drinkName: {
        type: String,
        required: [true, 'Drink name is required'],
        trim: true
    },
    size: {
        type: String,
        enum: ['Small', 'Medium', 'Large'],
        default: 'Medium'
    },
    customizations: {
        type: String,
        default: ''
    },
    rating: {
        type: Number,
        min: 1,
        max: 5, 
        default: null
    },
    notes: {
        type: String,
        default: ''
    }
}, {timestamps: true});

const CoffeeShopOrder = mongoose.model("CoffeeOrder", coffeeOrderSchema);

export default CoffeeShopOrder;