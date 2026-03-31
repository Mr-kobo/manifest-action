import { AuthMetas } from "~~/schemas/auth/auth-meta.schema";
import { User } from "~~/models/auth/user.model";
import { NotAuthenticated } from "~/models/core/errors.model";

export default defineEventHandler(async (event): Promise<{ twoFAEnabled: boolean; twoFAHasBeenValidated: boolean }> => {
	const params = getRouterParams(event);
	const session = await useServerSession(event);
	if (!session) {
		throw new NotAuthenticated()
	}
	const { retrieve } = useModels();
	const user = new User(session.user as any);

	if (params["identifier"] && session && user.identifier === params["identifier"]) {
		
		await retrieve(user, 'identifier');
		const authMetas = await AuthMetas.findOne({
			identifier: user.identifier,
		});

		let twoFAEnabled = user?.preferences?.enable2FA || false;
		let twoFAHasBeenValidated: boolean = (authMetas?.twofa?.secret?.length || 0) > 0;

		return { twoFAEnabled, twoFAHasBeenValidated };
	} else {
		throw new NotAuthenticated({ message: "[ERR] Cannot get status of 2FA for provided identifier." });
	}
});
