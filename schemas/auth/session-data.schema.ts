import moment from "moment-timezone";
import Mongoose from "mongoose";
import useMongooseModel from "~~/utils/use-mongoose-model";

export interface ISession {
    sessionID: string;
    sessionToken: string,
    userId: string,
    data: any;
    expires: Date,
}

const name = "Session-Data";
const schema = new Mongoose.Schema<ISession>(
    {
        sessionID: {
            type: String,
            required: true
        },
        sessionToken: {
            type: String,
            required: true
        },
        userId: {
            type: String,
        },
        data: {},
        expires: { type: Date, default: moment().add(1, "day").toDate(), expires: 0 }
    },
    {
        timestamps: {
            createdAt: "created",
            updatedAt: "updated"
        }
    }
);

schema.index({ created: 1 }, { expireAfterSeconds: 0 });
export const { model: SessionData } = useMongooseModel<ISession>(name, schema);
