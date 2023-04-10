import Joi from "joi";
export const categorySchema = Joi.object({
  name: Joi.string().required().messages({}),
});

export const categorySchemaUpdate = Joi.object({
  _id: Joi.string().required(),
  name: Joi.string().required(),
  products: Joi.array().required(),
  createdAt: Joi.date(),
  updatedAt: Joi.date(),
});