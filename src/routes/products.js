import express from "express";
import axios from "axios";
import { create, getALL, getOne, remove, update } from "../controller/products";
import { checkPermission } from "../midlewares/checkPermission";

const router = express.Router()
router.use(express.json());
// List
router.get('/products', getALL);
// Detail
router.get("/products/:id",getOne );

//ADD
router.post('/products' , checkPermission ,create )

//Update
router.put('/products/:id', checkPermission ,update )

//Delete
router.delete('/products/:id', checkPermission , remove )

export default router