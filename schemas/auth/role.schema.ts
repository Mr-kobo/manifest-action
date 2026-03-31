import Mongoose, { Types } from "mongoose";
import { z } from "zod";
import _ from "lodash";
import autopopulated from "mongoose-autopopulate";
import { idValidator } from "../validators/id.schema";
import useMongooseModel from "~~/utils/use-mongoose-model";

export const roleValidator = z.object({
    _id: idValidator.optional(),
    name: z.string().min(3),
    power: z.number(),
    profiles: z.array(z.string()).min(1),
    socket: z.object({
        capability: z.record(z.array(z.string())).optional()
    }).optional()
});

export type IRole = z.infer<typeof roleValidator>;

const modelName = 'Role';
const RoleSchema = new Mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    power: {
        type: Number,
        required: true
    },
    profiles: {
        type: [String],
        required: true
    }, 
    socket: {
        capability: { type: Object }
    }
});

// le plugin et le boolean permette d'avoir un populate automatique
RoleSchema.plugin(autopopulated);

export const { model: Roles } = useMongooseModel<IRole>(modelName, RoleSchema);