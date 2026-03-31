import Mongoose from "mongoose";
import { z } from "zod";
import _ from "lodash";
import autopopulated from "mongoose-autopopulate";
import { idValidator } from "../validators/id.schema";
import useMongooseModel from "~~/utils/use-mongoose-model";


export const sseEventValidator = z.object({
    _id: idValidator.optional(),
    eventId: z.string(),
    type: z.string(),
    data: z.object({}),
    done: z.boolean().default(false),
    slug: z.string(),
});

export type ISSEEvent = z.infer<typeof sseEventValidator>;

const modelName = 'SSE-Event';
const SSEEventSchema = new Mongoose.Schema({
    eventId: {
        type: String,
        required: true,
        unique: true,
        index: true,
    },
    type: {
        type: String,
        required: true
    },
    data: {
        type: Object,
        required: false
    },
    done: {
        type: Boolean,
        default: true
    },
    slug: {
        type: String,
        required: false
    }
});
    
SSEEventSchema.plugin(autopopulated);

export const { model: SSEEvent } = useMongooseModel<ISSEEvent>(modelName, SSEEventSchema);