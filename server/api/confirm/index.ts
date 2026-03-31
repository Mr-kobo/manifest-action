import { Users } from "~~/schemas/auth/user.schema";
import { AuthMetas, IAuthMeta } from "~~/schemas/auth/auth-meta.schema";
import { BadRequest } from "~/models/core/errors.model";


export default defineEventHandler(async (event) => {
  const query: any = getQuery(event);
  if (query['token'] && query['identifier']) {
    const { token, identifier } = query;
    console.log("QUERY", token, identifier);
    const { useVerificationToken } = useMongooseAdapter();
    if (useVerificationToken) {
      const result = await useVerificationToken({ identifier, token });
      console.log("TOKEN VERIFICATION", result);
      if (result) {
        // Apply the modification stored in AuthMeta
        const authMeta = await AuthMetas.findOne({ identifier }).exec();
        if (authMeta && authMeta.changes) {
          const changes = authMeta.changes;
          const user = await Users.findOneAndUpdate({ identifier }, changes);
          authMeta.changes = undefined;
          await authMeta.save();
        }

        if (query['callbackUrl']) {
          sendRedirect(event, `${query['callbackUrl']}?status=ok`);
        } else {
          return result;
        }
      } else {
        sendRedirect(event, `${query['callbackUrl']}?status=nok`);
        throw createError({ message: 'ERROR.FORBIDDEN', statusCode: 403 });
      }
    }
  } else {
    throw new BadRequest({ message: '[Bad Request] Missing token or identifer query arguments' });
  }

  return {}
});
