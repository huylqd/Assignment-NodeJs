import dotenv from "dotenv";
import joi from "joi";
import Category from "../models/category";
import Product from "../models/product";
import { categorySchema, categorySchemaUpdate } from "../schemas/category";

dotenv.config();


export const getAll = async (req, res) => {
    const {_keyword} = req.query
    try {
        const searchData = (categories) => {
            return categories?.docs?.filter((item) => item.name.toLowerCase().includes(_keyword))
        }
        const categories = await Category.paginate({});
        if (categories.length === 0) {
            return res.json({
                message: "Không có danh mục nào",
            });
        }
        const searchDataCategory = await searchData(categories)
        const productsRespone = await {...categories, docs: searchDataCategory}
        return res.json(productsRespone);
    } catch (error) {
        return res.status(400).json({
            message: error.message,
        });
    }
};
export const get = async function (req, res) {
    try {
        const category = await Category.findById(req.params.id).populate("products");
        if (!category) {
            return res.json({
                message: "Không có danh mục nào",
            });
        }

        // const products = await Product.find({ categoryId: req.params.id });

        // return res.json({ ...category.toObject(), products });
        return res.json(category)
    } catch (error) {
        return res.status(400).json({
            message: error.message,
        });
    }
};
export const create = async function (req, res) {
    try {
        const { error } = categorySchema.validate(req.body);
        if (error) {
            return res.status(400).json({
                message: error.details.map((err) => err.message),
            });
        }
        const category = await Category.create(req.body);
        if (!category) {
            return res.json({
                message: "Không thêm được danh mục",
            });
        }
        return res.json({
            message: "Thêm danh mục thành công",
            category,
        });
    } catch (error) {
        return res.status(400).json({
            message: error.message,
        });
    }
};
export const update = async function (req, res) {
    try {
        const { name, createdAt, updatedAt, products } = req.body;
        const { error } = categorySchemaUpdate.validate(req.body, {
          abortEarly: false,
        });
        if (error) {
          const errArr = error.details.map((err) => err.message);
          return res.status(400).json({ "lỗi validate": errArr });
        }
    
        const category = await Category.findOneAndUpdate(
          { _id: req.params.id },
          {
            $set: {
              _id: req.params.id,
              name: name,
              products: products,
              createdAt: createdAt,
              updatedAt: updatedAt,
            },
          },
          {
            new: true,
          }
        );
    
        if (!category) {
          res.json({
            message: "Cap nhat danh muc that bai",
          });
        }
        res.json({
          message: "Cap nhat danh muc thanh cong🎉",
          category,
        });
    } catch (error) {
        return res.status(400).json({
            message: error.message,
        });
    }
};
export const remove = async function (req, res) {
    try {
        const products = await Product.find({ categoryId: req.params.id });

        await Product.deleteMany({ categoryId: req.params.id });
        const category = await Category.findByIdAndDelete(req.params.id);
        return res.json({
            message: "Xóa danh mục thành công",
            category,
            products
        });
    } catch (error) {
        return res.status(400).json({
            message: error.message,
        });
    }
};