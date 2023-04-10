import express from "express";
import ProductRouter from './routes/products'
import categoryRouter from "./routes/category";
import UserRouter from './routes/auth'
import uploadImage from "./routes/upload";
import mongoose from "mongoose";
import cors from 'cors';

const app = express();
app.use(express.json());

app.use(cors())
app.use('/api',ProductRouter )
app.use("/api", categoryRouter);
app.use("/api", uploadImage);
app.use('/', UserRouter)


//connect to db
mongoose.connect("mongodb://localhost:27017/we17309");
export const viteNodeApp = app
