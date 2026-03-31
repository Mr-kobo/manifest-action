import hooks from "./hooks";
import { Products } from "~/schemas/business/product.schema";
import { Product } from "~/models/business/product.model";

export default useRest(Products, Product, hooks);