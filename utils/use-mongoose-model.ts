import mongoose, { Model, Schema, model as modelBuilder } from "mongoose";
import isServer from "./is-server";


export default function <T>(name: string, schema: Schema): { model: Model<T> } {
    // This is necessary to avoid model compilation errors in watch mode
    // see https://mongoosejs.com/docs/api/connection.html#connection_Connection-deleteModel
    if (isServer()) {
        if (mongoose.modelNames().includes(name)) {
            mongoose.deleteModel(name);
        }
        const model = modelBuilder<T>(name, schema);
        return { model };
    }
    return { model: undefined } as any; // mongoose model should be undefiend on client
}