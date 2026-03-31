
import speakeasy from "speakeasy";
import qrcode from "qrcode";
import useGenerateWords from "~~/server/utils/use-generate-words";
import { AuthMetas } from "~~/schemas/auth/auth-meta.schema";
import _ from "lodash";
import { User } from "~~/models/auth/user.model";
import { NotAuthenticated } from "~/models/core/errors.model";

export default defineEventHandler(
	async (event): Promise<{ isNew: boolean; identifier: string; recovery?: string; qrcode: string; hasBeenValidated: boolean }> => {
		const params = getRouterParams(event);
		const session = await useServerSession(event);
		if (!session) {
			throw new NotAuthenticated();
		}
		const user = new User(session.user as any);

		if (params["identifier"] && session && user.identifier === params["identifier"]) {
			const authMetas = await AuthMetas.findOne({
				identifier: params["identifier"],
			});

			if (authMetas) {
				if (authMetas.twofa && (authMetas.twofa.tempSecret || authMetas.twofa.secret)) {
					let generatedQr: string = "";
					let hasBeenValidated: boolean = false;

					if (authMetas.twofa && authMetas.twofa.tempSecret && authMetas.twofa.tempSecret.length > 0) {
						const authUrl = `otpauth://totp/SDNuxt:${authMetas.identifier}?secret=${authMetas.twofa.tempSecret}&issuer=SDNuxt&algorithm=SHA1&digits=6&period=30`;
						generatedQr = await qrcode.toDataURL(authUrl);
						hasBeenValidated = false;
					} else if (authMetas.twofa && authMetas.twofa.secret && authMetas.twofa.secret.length > 0) {
						const authUrl = `otpauth://totp/SDNuxt:${authMetas.identifier}?secret=${authMetas.twofa.secret}&issuer=SDNuxt&algorithm=SHA1&digits=6&period=30`;
						generatedQr = await qrcode.toDataURL(authUrl);
						hasBeenValidated = true;
					}

					return { isNew: false, identifier: authMetas.identifier, qrcode: generatedQr, hasBeenValidated: hasBeenValidated };
				} else {
					const newSecret = speakeasy.generateSecret().base32;
					const newRecover = await useGenerateWords(3);

					// console.log(newSecret);

					const authUrl = `otpauth://totp/SDNuxt:${params["identifier"]}?secret=${newSecret}&issuer=SDNuxt&algorithm=SHA1&digits=6&period=30`;
					const newQr = await qrcode.toDataURL(authUrl);

					authMetas.set("twofa.tempSecret", newSecret).set("twofa.recovery", newRecover).save();

					return {
						isNew: true,
						identifier: authMetas.identifier,
						recovery: newRecover,
						qrcode: newQr,
						hasBeenValidated: false,
					};
				}
			} else {
				throw new NotAuthenticated({ message: "[ERR] AuthMetas missing for provided identifier." });
			}
		} else {
			throw new NotAuthenticated({ message: "[ERR] Cannot gather 2FA datas for provided identifier." });
		}
	}
);
