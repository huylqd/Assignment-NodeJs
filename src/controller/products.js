import axios from "axios";
import dotenv from "dotenv"
import joi from 'joi'
import Product from "../models/product";
import Category from "../models/category"
import { productSchema, productSchemaUpdate } from "../schemas/product";

dotenv.config()

const { API_URL } = process.env;

export const getALL = async (req, res) => {

    const { _sort = "createAt", _order = "_asc", _limit = 10, _page = 1, _keywords } = req.query;
    const options = {
        page: _page,
        limit: _limit,
        sort: { [_sort]: _order === "desc" ? -1 : 1 },
    };

    try {
        const searchData = (products) => {
            return products?.docs?.filter((item) => item.name.toLowerCase().includes(_keywords))
        }
        const products = await Product.paginate({}, options);
        if (products.lenghth === 0) {
            return res.json({
                message: 'Không có sản phẩm nào',
            })
        }
        else {
            const searchDataProduct = await searchData(products)
            const productsRespone = await {...products, docs: searchDataProduct}
            return res.json(productsRespone);
        }

    } catch (error) {
        return res.status(400).json({
            message: error,
        });
    }
};

export const getOne = async function (req, res) {
    try {
        // const { data: product } = await axios.get(`${API_URL}/products/${req.params.id}`)
        const product = await Product.findById(req.params.id).populate("categoryId")
        if (!product) {
            return res.json({
                message: "Không có sản phẩm nào"
            })
        }
        return res.json(product);
    } catch (error) {
        return res.status(400).json({
            message: error
        })
    }
}

export const create = async function (req, res) {
    try {
        const { error } = productSchema.validate(req.body, { abortEarly: false });
        if (error) {
            return res.status(400).json({
                message: error.details.map(err => err.message)
            })
        }
        // const { data: product } = await axios.post(`${API_URL}/products`, req.body)
        const product = await Product.create(req.body)
        if (!product) {
            return res.json({
                message: "Không thêm sản phẩm nào"
            })
        }

        await Category.findByIdAndUpdate(product.categoryId, {
            $addToSet: {
                products: product._id
            }
        })

        return res.json({
            message: "Thêm sản phẩm thành công",
            data: product
        });
        
    } catch (error) {
        return res.status(400).json({
            message: error
        })
    }
}

export const update = async function (req, res) {
    try {
        const {
            name,
            price,
            description,
            image,
            createdAt,
            updatedAt,
            categoryId,
          } = req.body;
        const oldData = await Product.findById(req.params.id);
        const oldCategory = await oldData.categoryId;
        const newCategory = categoryId;
        const { error } = productSchemaUpdate.validate(req.body, {
            abortEarly: false,
          });
          if (error) {
            const errArr = error.details.map((err) => err.message);
            return res.status(400).json({ "lỗi validate": errArr });
          }
          const productUpdated = await Product.findOneAndUpdate(
            { _id: req.params.id },
            {
              $set: {
                _id: req.params.id,
                name: name,
                price: price,
                description: description,
                image: image,
                createdAt: createdAt,
                updatedAt: updatedAt,
                categoryId: categoryId,
              },
            },
            {
              new: true,
            }
          );

          await Category.findByIdAndUpdate(
            { _id: oldCategory },
            {
              $pull: { products: productUpdated._id },
            },
            { new: true }
          );
      
          //thêm product vào category mới
          await Category.findByIdAndUpdate(
            { _id: newCategory },
            {
              $push: { products: productUpdated._id },
            },
            { new: true }
          );
          if (!productUpdated) {
            res.json({
              message: "Cap nhat san pham that bai",
            });
          }
          res.json({
            message: "Cap nhat san pham thanh cong🎉",
            productUpdated,
          });
    } catch (error) {
        return res.status(400).json({
            message: error
        })
    }
}

export const remove = async function (req, res) {
    try {
        await Product.deleteOne({ _id: req.params.id })
        res.json({
            message: 'Xóa sản phẩm thành công',
        })
    } catch (error) {
        return res.status(400).json({
            message: error,
        });
    }
}