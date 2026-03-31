import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import EmailProvider from "next-auth/providers/email";
import speakeasy from "speakeasy";
import moment from "moment-timezone";
import crypto from "crypto";
import _ from "lodash";
import { NuxtAuthHandler } from "#auth";
import { AuthMetas, IAuthMeta } from "~~/schemas/auth/auth-meta.schema";
import { User } from "~~/models/auth/user.model";
import { AuthTokens } from "~~/schemas/auth/auth-token.schema";
import { IUser, Users } from "~~/schemas/auth/user.schema";
import { ITokenValidator, tokenValidator, loginValidator } from "~~/schemas/validators/login.schema";
import useMongooseAdapter from "~~/server/utils/use-mongoose-adapter";
import useSend, { SendTemplates } from "~~/server/utils/use-send";
import { Forbidden, NotAuthenticated, NotFound } from "~/models/core/errors.model";


const { debug, authentication, mongodb, public: publicConfig } = useRuntimeConfig();
const app_config = useAppConfig();
export default NuxtAuthHandler({
	// A secret string you define, to ensure correct encryption
	secret: authentication.secret,
	// debug: !isProduction(),
	adapter: useMongooseAdapter(),
	session: {
		strategy: "jwt",
		maxAge: 30 * 24 * 60 * 60, // 30 days
		updateAge: 24 * 60 * 60, // 24 hours
	},
	// useSecureCookies: isProduction(),
	pages: {
		// Change the default behavior to use `/login` as the path for the sign-in page
		signIn: "/auth/login",
		error: "/error",
		verifyRequest: "/auth/verify"
	},
	callbacks: {
		jwt: async ({ token, user, account, profile, session, trigger }) => {
			// this is not null on SignIn
			if (account) {
				if ((user as any).role?.socket) {
					const capability = (user as any).role?.socket.capability;
					// create socket session and store id in jwt
					// const { requestToken } = useSockerServer();
					// const result = await requestToken((user as any).identifier, capability);
					// console.log('[Socket Token]', result);
					// if (result)
					// 	token.socket = result;
				}
			}

			if (user) {
				token.user = { ...user };
				delete (token.user as any).password;
			}
			return Promise.resolve(token);
		},
		signIn: async ({ account, user: u, email, credentials, profile }) => {
			console.log("[SIGNIN] account", account, "user", u, "email", email, "credentials", credentials, "profile", profile);
			
			const { save } = useModels();
			const baseUser: IUser = u as any; 
            baseUser.identifier = u.email || "none";
			const user: User = new User(baseUser);
			const { identifier } = user;

			if (!user) {
				throw new NotAuthenticated();
			}
			
			// user is currently in a verification request
			if (email && email.verificationRequest) {
				// it is possible to check here if the email belong to an authorized list of not
				const config = useRuntimeConfig();

				// check if it exist in database if not create it
				const exist = await Users.findOne({ identifier });
				if (!exist && config.authentication.flags.userOnLogCreation) {
					await save(user);
				} else if (!exist && !config.authentication.flags.userOnLogCreation) {
					throw new Forbidden({ message: 'error.unable_to_link_to_existing_account' });
				}

				return true;
			}

			// OAUTH check if verified (update auth-meta)
			if (user.emailVerified || (profile as any)?.email_verified) { // oauth providers
				await AuthMetas.findOneAndUpdate({ identifier }, { 'meta.verified': moment().toISOString() })
			}

			// check for opt-in
			const authMeta: IAuthMeta | null = await AuthMetas.findOne({ identifier });
			if (!authMeta) {
				throw new NotFound({ message: "error.user_missing_metas" });
			}

			if (account?.type !== 'email' && (app_config.auth.verification && !authMeta.meta?.verified)) {
				return `/auth/verify/${user.contact}/${identifier}/send`
			}

			//check for enabled
			if (!authMeta.meta?.enabled) {
				throw new Forbidden({ message: "error.user_disabled" });
			}

			// check for 2FA
			if (account?.provider === "credentials") {
				if (user.preferences?.enable2FA) {
					await AuthTokens.deleteMany({ identifier: `2FA-${identifier}`, token: "FA_GRANTED" });
					await AuthTokens.create({ identifier: `2FA-${identifier}`, token: "FA_GRANTED" });
					return `/auth/verify/2FA/${identifier}`;
				}
			}

			// TEST PUBLISH FROM SERVER
			// const { channels } = useSockerServer();
			// channels.get('everyone').publish('welcolme', `Welcolme ${user.identifier} for logging in !`);

			return true; // everything is ok
		},
		session: async ({ session, token }) => {
			const u = (token as any).user;
			if (u.id || u._id) {
				const user = (await Users.findById(u.id || u._id))?.toJSON() as any;
				session.user = useProtect(user, "password");
			}
			// check for stayLog Value
			const stayLog = (session as any).user?.preferences?.stayLog;
			if (!_.isNil(stayLog) && !stayLog) {
				session.expires = moment().add(1, "day").toISOString();
			}

			// set socket token
			// let socket: any = token.socket;
			// if (socket) {
			// 	// check validity
			// 	if (moment().isAfter(moment(socket.expires))) {
			// 		const { refresh } = useSockerServer();
			// 		socket = await refresh(socket);
			// 	}
			// 	token.socket = (session as any).socket = socket;
			// }
			return Promise.resolve(session);
		},
	},
	providers: [
		// @ts-expect-error You need to use .default here for it to work during SSR. May be fixed via Vite at some point
		CredentialsProvider.default({
			// The name to display on the sign in form (e.g. 'Sign in with...')
			name: "Credentials",
			async authorize(credentials: any) {
				// has to cast boolean from string to be validated by the schema
				Object.keys(credentials).forEach(
					(key: any) => (credentials[key] === "true" || credentials[key] === "false") && (credentials[key] = JSON.parse(credentials[key]))
				);

				if (!credentials || !loginValidator.safeParse(credentials).success) {
					return null;
				}

				// hash credential password
				// const salt = bcrypt.genSaltSync(authentication.saltRounds);
				const hashed = crypto.pbkdf2Sync(credentials.password, authentication.salt, 10000, 64, "sha512").toString("hex");
				// The resulting `hash` value can be stored in the database for later use.

				// find corresponding user in
				const user = await Users.findOne({
					identifier: credentials.identifier,
					password: hashed,
				});

				if (user) {
					const { save } = useModels();
					// set stayLog value
					if (credentials.stayLog !== undefined && user.preferences.stayLog !== credentials.stayLog) {
						user.preferences.stayLog = credentials.stayLog;
						await save(new User(user));
					}

					// Any object returned will be saved in `user` property of the JWT
					return useProtect(user.toJSON(), "password");
				} else {
					// eslint-disable-next-line no-console
					console.error("Warning: Malicious login attempt registered, bad credentials provided");
					// If you return null then an error will be displayed advising the user to check their details.
					return null;
					// You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
				}
			},
		}),
		// @ts-expect-error You need to use .default here for it to work during SSR. May be fixed via Vite at some point
		CredentialsProvider.default({
			// The name to display on the sign in form (e.g. 'Sign in with...')
			name: "2FA",
			id: "2FA",
			async authorize(credentials: ITokenValidator) {
				// has to cast boolean from string to be validated by the schema
				if (!credentials || !tokenValidator.safeParse(credentials).success) {
					return null;
				}
				// find user
				const u = await Users.findOne({ identifier: credentials.identifier });
				if (!u) {
					return null;
				}
				const user = new User(u);

				const authToken = await AuthTokens.findOne({ identifier: `2FA-${user.identifier}`, token: "FA_GRANTED" });
				if (!authToken) {
					throw new NotAuthenticated({ message: "FIRST_STEP_EXPIRED" });
				} else if (credentials.token) {
					const token = credentials.token;
					// validate 2FA token here
					let valid: any = false;

					const authMetas = await AuthMetas.findOne({
						identifier: credentials.identifier,
					});

					valid = authMetas?.twofa?.secret && speakeasy.totp.verify({
						secret: authMetas.twofa.secret,
						encoding: "base32",
						token: token,
					});

					if (valid) {
						return user.toJSON();
					}
				}

				return null;
			},
		}),
		// @ts-expect-error You need to use .default here for it to work during SSR. May be fixed via Vite at some point
		GoogleProvider.default({
			clientId: authentication.oauth.google.clientId,
			clientSecret: authentication.oauth.google.secret,
			profile: async (profile: any, token: any) => {
				const config = useRuntimeConfig();

				// check if exist in database if not create it
				const exist = await Users.findOne({ email: profile.email });
				if (exist) {
					const user = new User(exist);
					// link account and link auth meta
					await AuthMetas.findOneAndUpdate({ identifier: user.identifier }, { 'oauth.google': profile });
					await Users.findOneAndUpdate({ identifier: user.identifier }, {
						'profil': {
							firstname: profile.given_name,
							lastname: profile.family_name,
							avatar: profile.picture
						}
					});
					(user as any).id = user._id;
					return user.toJSON();
				} else if (
					// if on log user creation is authorized
					config.authentication.flags.userOnLogCreation
				) {
					const { save } = useModels();
					const data = await save(new User({
						identifier: profile.email,
						profil: {
							firstname: profile.given_name,
							lastname: profile.family_name,
							avatar: profile.picture,
						}
					}));
					return data?.toJSON();
				}

				throw new Forbidden({ message: 'error.unable_to_link_to_existing_account' });
			},
		}),
		// @ts-expect-error You need to use .default here for it to work during SSR. May be fixed via Vite at some point
		EmailProvider.default({
			name: "Email",
			id: "email",
			secret: authentication.secret,
			// server: authentication.mail.server,
			// from: authentication.mail.from,
			async generateVerificationToken() {
                let code;
                if(!debug) code = useGeneratePincode(6);
                else {
                    code = 123456;
                    console.log('\x1b[31m%s\x1b[0m','[VERIFY CODE] ' + code);
                }
				return code // generate a pincode as key
			},
			async sendVerificationRequest(params: any) {
				// console.log("[MAIL PARAMS]", params);
				const { identifier, token, url, provider, theme } = params
				const { host } = new URL(url);
				const { send } = useSend(SendTransports.MAIL);

				// TODO: do our graphic chart
				const escapedHost = host.replace(/\./g, "&#8203;.")
				const brandColor = theme.brandColor || "#346df1"
				const color = {
					background: "#f9f9f9",
					text: "#444",
					mainBackground: "#fff",
					buttonBackground: brandColor,
					buttonBorder: brandColor,
					buttonText: theme.buttonText || "#fff",
				}

				return await send({
					to: identifier,
					subject: `Sign in to ${host}`,
					slug: SendTemplates.SIGN_IN,
					data: {
						escapedHost,
						brandColor,
						color,
						token,
						url
					}
				});
			}
		}),
		// @ts-expect-error You need to use .default here for it to work during SSR. May be fixed via Vite at some point
		EmailProvider.default({
			name: "SMS",
			id: "sms",
			secret: authentication.secret,
			async generateVerificationToken() {
				return useGeneratePincode(6) // generate a pincode as key
			},
			async sendVerificationRequest(params: any) {
				console.log("[SMS PARAMS]", params);
				const { identifier, token, url, theme } = params
				const { host } = new URL(url);
				const { send } = useSend(SendTransports.SMS);

				const escapedHost = host.replace(/\./g, "&#8203;.")

				return await send({
					to: identifier,
					subject: `Sign in to ${host}`,
					slug: SendTemplates.SIGN_IN,
					data: {
						escapedHost,
						token,
						url
					}
				});
			},
			normalizeIdentifier(identifier: string): string {
				// override default normalisation as we pass a phone number instead of email
				return identifier;
			}
		})
	],
});
