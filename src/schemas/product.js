import Joi from "joi";
export const productSchema = Joi.object({
  name: Joi.string().required(),
  price: Joi.number().required(),
  description: Joi.string(),
  image: Joi.array(),
  categoryId: Joi.string().required(),
});

export const productSchemaUpdate = Joi.object({
  _id: Joi.string().required(),
  name: Joi.string().required(),
  price: Joi.number().required(),
  description: Joi.string(),
  image: Joi.array(),
  categoryId: Joi.string().required(),
  createdAt: Joi.date(),
  updatedAt: Joi.date(),
  categoryId: Joi.string().required(),
});