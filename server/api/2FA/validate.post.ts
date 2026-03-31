import speakeasy from "speakeasy";
import { AuthMetas } from "~~/schemas/auth/auth-meta.schema";
import { User } from "~~/models/auth/user.model";
import { NotAuthenticated } from "~/models/core/errors.model";

export default defineEventHandler(async (event): Promise<boolean> => {
	const params = await readBody(event);
	const session = await useServerSession(event);
	if (!session) {
		throw new NotAuthenticated()
	}
	const { retrieve, save } = useModels();
	const user = new User(session.user as any);

	if (params["identifier"] && session && user.identifier === params["identifier"] && params["token"] && params["token"].length === 6) {
		const authMetas = await AuthMetas.findOne({
			identifier: user.identifier,
		});

		if (authMetas?.twofa?.tempSecret &&
			speakeasy.totp.verify({
				secret: authMetas.twofa.tempSecret,
				encoding: "base32",
				token: params["token"],
			})
		) {
			if (authMetas?.twofa?.tempSecret?.length) {
				authMetas.set("twofa.secret", authMetas.twofa.tempSecret).set("twofa.tempSecret", undefined).save();
				await retrieve<User>(user, 'identifier');
				if (user) {
					user.preferences.enable2FA = true;
					await save<User>(user);
				}

				return true;
			}
		}

		return false;
	} else {
		throw new NotAuthenticated({ message: "[ERR] Cannot update 2FA datas for provided identifier." });
	}
});
