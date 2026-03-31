import Mongoose, { Types } from "mongoose";
import _ from "lodash";
import { roleValidator } from "./role.schema";
import { z, ZodIssueCode } from "zod";
import autopopulated from "mongoose-autopopulate";
import { passwordSchema } from "../validators/password.schema";
import crypto from 'crypto';
import { AuthMetas } from "./auth-meta.schema";
import { emailValidator, identifierValidator, phoneValidator } from "../validators/login.schema";
import { dateValidator, idValidator } from "../validators/id.schema";
import useMongooseModel from "~~/utils/use-mongoose-model";

// const config = useRuntimeConfig();

//#region SCHEMAS
//#region Front & Middleware
export const userProfilValidator = z.object({
    firstname: z.string().nonempty(),
    lastname: z.string().nonempty(),
    avatar: z.string().default(""),
});

export const userValidator = z.object({
    _id: idValidator.optional(),
    identifier: identifierValidator,
    email: emailValidator.optional(), // l'email est maintenant facultatif
    phone: phoneValidator.optional(), // le téléphone est maintenant facultatif
    password: z.string().optional(),
    roleID: idValidator,
    role: roleValidator.optional(),
    profil: userProfilValidator.optional(),
    preferences: z.object({
        stayLog: z.boolean().default(false),
        enable2FA: z.boolean().default(false),
        locale: z.string().default("fr-FR"),
    }),
    contact: z.enum(['email', 'sms']).optional(),
    contacts: z.array(z.enum(['email', 'sms'])).optional(),
    emailVerified: dateValidator.optional()
}).refine((data) => {
    // si l'email est null, le téléphone doit être défini
    // si le téléphone est null, l'email doit être défini
    return (_.isNil(data.identifier) || _.isNil(data.email) && !_.isNil(data.phone)) || (_.isNil(data.phone) && !_.isNil(data.email));
}, { params: { code: ZodIssueCode.custom, i18n: { key: "zod.errors.identifier_missing" } } });

export const userRegisterValidator = z.object({
    identifier: identifierValidator,
    // ...(config.public.authenticationProviders.type === configAuthType.credentials && {
    password: passwordSchema({
        minLength: 5,
        maxLength: 25,
        numberSpecialChars: 2,
        numberCapitals: 1,
    }),
    confirm_password: z.string(),
    // }),
    rgpd: z.coerce.boolean().refine(bool => bool == true,
        { params: { code: ZodIssueCode.custom, i18n: { key: "zod.errors.rgpd" } } }
    ),
});

export const userUpdatePasswordValidator = z.object({
    password: passwordSchema({
        minLength: 5,
        maxLength: 25,
        numberSpecialChars: 2,
        numberCapitals: 1,
    }),
    confirm_password: z.string(),
});
//#endregion

//#region MONGOOSE
const modelName = "User";
const UserSchema = new Mongoose.Schema<IUser>(
    {
        identifier: {
            type: String,
            required: true,
            unique: true,
            index: true,
            set: function (v) {
                if (emailValidator.safeParse(v).success) {
                    this.setUpdate(_.assign(this.getUpdate(), { email: v }));
                }
                if (phoneValidator.safeParse(v).success) {
                    this.setUpdate(_.assign(this.getUpdate(), { phone: v }));
                }
                return v;
            },
        },
        email: {
            type: String,
        },
        phone: {
            type: String,
        },
        password: {
            type: String,
        },
        emailVerified: { type: Date },
        roleID: {
            type: Mongoose.Schema.Types.ObjectId,
            ref: "Role",
            default: new Types.ObjectId("642ae022e55cdda59e73a003") // set role "admin-company" as default
        },
        profil: {
            firstname: { type: String, default: "" },
            lastname: { type: String, default: "" },
            avatar: { type: String, default: "" },
        },
        preferences: {
            stayLog: { type: Boolean, default: true },
            enable2FA: { type: Boolean, default: false },
            locale: { type: String, default: "fr" },
        },

    },
    {
        //define VIRTUALS
        virtuals: {
            role: {
                options: {
                    ref: "Role",
                    localField: "roleID",
                    foreignField: "_id",
                    justOne: true,
                    autopopulate: true, // The below option tells this plugin to always call `populate()` on `populatedField`
                },
            },
            contact: {
                get: function () {
                    if (emailValidator.safeParse(this.identifier).success) {
                        return 'email';
                    }
                    if (phoneValidator.safeParse(this.identifier).success) {
                        return 'sms';
                    }
                    return 'none';
                }
            },
            contacts: {
                get: function () {
                    const available: ('email' | 'sms')[] = [];
                    if (this.email) available.push('email');
                    if (this.phone) available.push('sms');
                    return available;
                }
            },
        },

        // tell mongoose to include virtuals in JSON
        toJSON: {
            virtuals: true,
        },
        toObject: {
            virtuals: true
        },

    }
);
// le plugin et le boolean permette d'avoir un populate automatique
UserSchema.plugin(autopopulated);

// HOOKS 
// les hooks permettent de generaliser des querty pour l'ensemble des requettes sur un model
// UserSchema.pre(/^find/, function (next) {
//     console.log("Hook pre", this)
//     next();
// });

// hash password on before all type of update
UserSchema.pre(/(?:update)/i, async function (next) {
    const update = this.getUpdate();
    const password = update['$set']?.password || update.password;
    // console.log('[PRE UPDATE]', this.getUpdate(), password);
    if (!update || !password) return next();

    const { authentication } = useRuntimeConfig();
    const hash = crypto.pbkdf2Sync(password, authentication.salt, 10000, 64, 'sha512').toString('hex');
    this.setUpdate(_.assign(this.getUpdate(), { password: hash }));
    next();
});

// Set email or phone corresponding to identifier
UserSchema.pre(/(?:update)/i, async function (next) {
    const update = this.getUpdate();
    const identifier = update?.identifier;
    if (identifier) {
        if (emailValidator.safeParse(identifier).success) {
            this.setUpdate(_.assign(this.getUpdate(), { email: identifier }));
        }
        if (phoneValidator.safeParse(identifier).success) {
            this.setUpdate(_.assign(this.getUpdate(), { phone: identifier }));
        }
    }
    next();
});

UserSchema.post(/(?:update)/i, async function (value, next) {
    // console.log('[POST UPDATE]');
    // create an Auth-metas if one is not already defined
    if (await value || this.getUpdate()) {
        const { identifier } = value || this.getUpdate()['$set'];
        if (identifier) {
            const exist = await AuthMetas.exists({ identifier: identifier });
            if (!exist) {
                console.log('[AUTH META] create auth-meta for user : ' + identifier);
                await AuthMetas.create({ identifier: identifier });
            }
        }
    }
    next();
});

UserSchema.post(/.*/i, async function (value) {
    // console.log('[HELLOOEOEO]', await value, this.getUpdate());
    // next();
});
//#endregion
//#endregion

export type IUser = z.infer<typeof userValidator>;
export type IProfil = z.infer<typeof userProfilValidator>;
export type IUserRegister = z.infer<typeof userRegisterValidator>;
export type IUserUpdatePassword = z.infer<typeof userUpdatePasswordValidator>;

export const { model: Users } = useMongooseModel<IUser>(modelName, UserSchema);
