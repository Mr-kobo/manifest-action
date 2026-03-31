import { AuthMetas } from "~~/schemas/auth/auth-meta.schema";
import { User } from "~~/models/auth/user.model";
import { NotAuthenticated } from "~/models/core/errors.model";

export default defineEventHandler(async (event): Promise<null> => {
	const params = await readBody(event);
	const session = await useServerSession(event);
	if (!session) {
		throw new NotAuthenticated()
	}
	const { retrieve, save } = useModels();
		
	const user = new User(session.user as any);

	if (
		params["identifier"] &&
		session &&
		user.identifier === params["identifier"] &&
		(params["enabled"] === true || params["enabled"] === false)
	) {
		await retrieve<User>(user, 'identifier');
		if (user && user.identifier) {
			const authMetas = await AuthMetas.findOne({
				identifier: user.identifier,
			});

			if (authMetas?.twofa?.secret?.length) {
				user.preferences.enable2FA = params["enabled"];
				await save<User>(user);
				if(!params["enabled"]){
					authMetas.set("twofa", null).save();
				}
			}
		}

		return null;
	} else {
		throw new NotAuthenticated({ message: "[ERR] Cannot update 2FA datas for provided identifier." });
	}
});
