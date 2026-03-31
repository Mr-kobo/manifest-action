import validator from "validator";
import { z, ZodIssueCode } from "zod";
import app_config, { ConfigIdentifier } from "~/app.config";

export const emailValidator = z.string().email();
export const phoneValidator = z.string().refine(validator.isMobilePhone);

export const identifierValidator = app_config.auth.identifier === ConfigIdentifier.BOTH ? z.union([phoneValidator, emailValidator]) : (app_config.auth.identifier === ConfigIdentifier.EMAIL ? emailValidator : phoneValidator);

export const loginValidator = z.object({
	identifier: identifierValidator,
	password: z.string(),
	stayLog: z.boolean().optional(),
});
export type ILoginValidator = z.infer<typeof loginValidator>;

export const registerPasswordless = z.object({
	identifier: identifierValidator,
	rgpd: z.coerce.boolean().refine(bool => bool == true,
		{ params: { code: ZodIssueCode.custom, i18n: { key: "zod.errors.rgpd" } } }
	).optional(),
});
export type IRegisterPasswordless = z.infer<typeof registerPasswordless>;

export const tokenValidator = z.object({
	identifier: identifierValidator,
	token: z.string().optional(),
	stayLog: z.boolean().optional(),
});
export type ITokenValidator = z.infer<typeof tokenValidator>;

export enum ValidationType {
	TWOFA = '2FA',
	EMAIL = 'email',
	SMS = 'sms',
	TWOQR = '2FAQR',
	CONFIRM = 'confirm'
}