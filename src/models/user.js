import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
    },
    email: {
        type: String,
        require: true,
    },
    password: {
        type: String,
        require: true,
    },
    confirmPassword: {
        type: String,
        require: true,
    },
    role: {
        type: String,
        default: "member"
    },
},
{ timestamps: true, versionKey: false }
);

export default mongoose.model("User", userSchema)