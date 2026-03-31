import moment from "moment-timezone";
import Mongoose from "mongoose";
import useMongooseModel from "~~/utils/use-mongoose-model";
import app_config from "~/app.config";
export interface IAuthToken {
    identifier: string;
    token?: string;
}

const name = "Auth-Token";
const schema = new Mongoose.Schema(
    {
        identifier: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        },
        expires: {
            type: Date,
            default: () => moment().add(app_config.auth.tokenExpiration, "minutes").toDate(),
            index: { expireAfterSeconds: 0 }
        }
    },
    {
        timestamps: {
            createdAt: "created",
            updatedAt: "updated"
        }
    }
);

export const { model: AuthTokens } = useMongooseModel(name, schema);
