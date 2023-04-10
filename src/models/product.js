import { object } from "joi";
import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2"

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        default: "Product no name",
        required: true,
        maxLength: 255,
    },
    price: {
        type: Number, default: 20000, required: true, maxLength: 255
    },
    description: {
        type: String,
      default: "This is amazing product",
    },
    image: [ 
        {
        type: Object,
        required: true
        }
    ],
    categoryId: {
        type: mongoose.Types.ObjectId,
        ref: "Category",
    },
})

productSchema.plugin(mongoosePaginate)

export default mongoose.model("Product", productSchema)