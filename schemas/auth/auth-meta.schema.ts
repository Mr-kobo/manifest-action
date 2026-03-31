import Mongoose from "mongoose";
import useMongooseModel from "~~/utils/use-mongoose-model";

export interface IAuthMeta {
    identifier: string;
    meta: {
        verified?: Date;
        enabled?: boolean;
    };
    twofa?: {
        tempSecret?: string;
        secret?: string;
        recovery?: string;
    };
    changes?: { [key: string]: any };
    oauth?: {
        google?: IOAuthProfile;
    };
}

const name = "Auth-Meta";
const schema = new Mongoose.Schema(
    {
        identifier: {
            type: String,
            required: true,
            unique: true,
            index: true
        },
        meta: {
            verified: { type: Date, default: undefined },
            enabled: { type: Boolean, default: true }
        },
        twofa: {
            tempSecret: {
                type: String,
                required: false
            },
            secret: {
                type: String,
                required: false
            },
            recovery: {
                type: String,
                required: false
            }
        },
        changes: {},
        oauth: {}
    },
    {
        timestamps: {
            createdAt: "created",
            updatedAt: "updated"
        }
    }
);

export const { model: AuthMetas } = useMongooseModel<IAuthMeta>(name, schema);

export interface IOAuthProfile {
    iss: string;
    azp: string;
    aud: string;
    sub: string;
    email: string;
    email_verified: boolean;
    at_hash: string;
    name: string;
    picture: string;
    given_name: string;
    family_name: string;
    locale: string;
    iat: number;
    exp: number;
}
