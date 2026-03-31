import _ from "lodash";
import moment from "moment-timezone";
import { AuthMetas } from "~~/schemas/auth/auth-meta.schema";
import { User } from "~~/models/auth/user.model";
import { SendTransports } from "./use-send";
import { H3Event } from 'h3';
import { Id } from "~~/models/core/base.model";
import { GeneralError, NotFound } from "~/models/core/errors.model";

const app_config = useAppConfig();
/**
 * useRequireConfirmation :
 * retrieve changes corresponding to 'members' in body, generate a token, send it to user through main 'contact' transport.
 * @return redirect the request to the client /auth/verify/confirm page  
 */
export default async (event: H3Event, userID: Id, members: string[],) => {
  const { callbackUrl } = getQuery(event);
  const body = await readBody(event);
  const { retrieve } = useModels();

  const escaped = body;
  const changes: any = {};
  
  for (let member of members) {
    if (Object.keys(body).includes(member)) {
      changes[member] = body[member];
      delete escaped[member];
    }
  }

  if (!_.isEmpty(changes)) {
    const user = await retrieve(new User({ _id: userID }));
    if (!user) {
      throw new NotFound({ cause: "ERROR.USER_MISSING" });
    }
    const identifier = user.identifier;

    // Set changes in Auth meta
    await AuthMetas.findOneAndUpdate({ identifier }, { $set: { changes } }).exec();

    // Generate an token 
    const token = useGeneratePincode(6);
    const { createVerificationToken } = useMongooseAdapter();
    if (!createVerificationToken) {
      throw new GeneralError();
    }
    // create the AuthToken
    const authToken = await createVerificationToken({
      token: token.toString(),
      identifier,
      expires: moment().add(app_config.auth.tokenExpiration, 'minutes').toDate()
    });
    console.log('[AUTH TOKEN]',authToken);

    // Send
    const { send } = useSend();
    const config = useRuntimeConfig();
    const url = `${config.public.host}/api/confirm?token=${token}&identifier=${identifier}&callbackUrl=${callbackUrl || '/auth/profile'}`;
    const { host } = new URL(url);
    const escapedHost = host.replace(/\./g, "&#8203;.")

    // TODO: do our graphic chart and set this in the css
    const brandColor = "#346df1"
    const color = {
      background: "#f9f9f9",
      text: "#444",
      mainBackground: "#fff",
      buttonBackground: brandColor,
      buttonBorder: brandColor,
      buttonText: "#fff",
    }

    await send({
      transport: user.contact as SendTransports,
      slug: SendTemplates.CONFIRM,
      subject: 'Confirm your modifications',
      to: user.identifier,
      data: {
        escapedHost,
        brandColor,
        color,
        token,
        url
      },
    });

    // redirect to verify
    console.log('[USE REQUIRE CONFIRMATION]', token);
    await sendRedirect(event, `${config.public.host}/auth/verify/confirm/${identifier}`);
  }

  return {
    escaped
  }
};


