import { z } from "zod";
import _ from "lodash";
import { idValidator } from "../validators/id.schema";

export const mediaValidator = z.object({
    _id: idValidator.optional(),
    slug: z.string(),
    // size: z.number(), 
    uri: z.string(),
    key: z.string(),
    contentType: z.string(),
    payload: z.any(),
});

export type IMedia = z.infer<typeof mediaValidator>;