import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2"


const categorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            require: true,
            minLength: 3,
        },
        products: [
            {
                type: mongoose.Types.ObjectId,
                ref: "Product"
            },
        ],
    },
    { timestamps: true, versionKey: false }
);
categorySchema.plugin(mongoosePaginate)
export default mongoose.model("Category", categorySchema);