import _ from "lodash";
import AModel from "../core/model";
import { AppPermissions } from "~/app.config";
import { IProduct, IProductDetails, Products, productValidator } from "~/schemas/business/product.schema";

export class Product extends AModel<IProduct> implements IProduct {
    name: string;
    price: number;
    details: IProductDetails;

    constructor(data: Partial<IProduct> = {}) {
        super(productValidator, Products, "/api/product");
        // Initialize data on Daughter level
        this.init(data);
    }

    canBuy(amount: number): boolean {
        return (this.price || 0) <= amount;
    }
}