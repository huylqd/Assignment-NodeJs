import axios from "axios";
import dotenv from 'dotenv';
import User from "../models/user"
import { signUpSchema, signInSchema } from "../schemas/auth";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken";

dotenv.config();

const { API_URL } = process.env;

export const signUp = async (req, res) => {
    try {
        const { name, email, password, confirmPassword } = req.body;

        const { error } = signUpSchema.validate(req.body, { abortEarly: false });
        if (error) {
            const errors = error.details.map((err) => err.message);
            return res.status(400).json({
                message: errors
            })
        }

        const userExits = await User.findOne({ email })
        if (userExits) {
            return res.status(400).json({
                message: "user already exits"
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        

        const user = await User.create({
            name,
            email,
            password: hashedPassword
        })

        const token = jwt.sign({ _id: user._id }, "123456", {expiresIn: "1h"});
        return res.json({
            accessToken : token,
            message: "User created successfully",
            user: user
        })

    } catch (error) {
        return res.status(400).json({
            message: error
        })
    }
}

export const signIn = async (req, res) => {
    try {
        const {email, password} = req.body

        const {error} = signInSchema.validate({email, password}, {abortEarly: false})
        if(error) {
            const errors = error.details.map((err) => err.message)
            return res.status(400).json({
                message: errors
            })
        }

        const user = await User.findOne({email});
        if(!user) {
            return res.status(400).json({message: "Tài khoản không tồn tại"})
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch) {
            return res.status(400).json({
                message: "Mật khẩu không khớp"
            })
        }
        const token = jwt.sign({_id: user._id, role: user.role}, "123456")
        user.password = undefined;
        res.status(200).json({
            message: "Đăng nhập thành công",
            data: user,
            accessToken: token,
        });
    } catch (error) {
        if (error.name === "ValidationError") {
            return res.status(400).json({ message: error.errors[0] });
        }
        res.status(500).json({ message: "Internal Server Error" }); 
    }
}
