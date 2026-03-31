import Mongoose, { Types } from "mongoose";
import { z } from "zod";
import _ from "lodash";
import autopopulated from "mongoose-autopopulate";
import { idValidator } from "../validators/id.schema";
import useMongooseModel from "~~/utils/use-mongoose-model";
import { IUser } from "../auth/user.schema";

export const productDetailsValidator = z.object({
    description: z.string().min(5).optional(),
    manufacturer: z.string().min(3).optional(),
    warrantyPeriod: z.number().min(0).optional(), // en mois
    stock: z.number().min(0).optional(),
});

export const productValidator = z.object({
    _id: idValidator.optional(),
    name: z.string().min(3),
    price: z.number().min(0),
    details: productDetailsValidator,
});

export type IProduct = z.infer<typeof productValidator>;
export type IProductDetails = z.infer<typeof productDetailsValidator>;

const modelName = 'Product';
const ProductSchema = new Mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    details: {
        description: { type: String, default: "" },
        manufacturer: { type: String, default: "" },
        warrantyPeriod: { type: Number, default: 0 }, // en mois
        stock: { type: Number, default: 0 },
    }
});

// le plugin et le boolean permette d'avoir un populate automatique
ProductSchema.plugin(autopopulated);

export const { model: Products } = useMongooseModel<IProduct>(modelName, ProductSchema);