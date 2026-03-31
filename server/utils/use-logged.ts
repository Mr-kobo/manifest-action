import { User } from "~~/models/auth/user.model";
import { H3Event } from 'h3';
import { NotAuthenticated } from "~/models/core/errors.model";

export default async (event: H3Event, throw_error: boolean = true) => {
  const session = await useServerSession(event);
  if (throw_error && !session) {
    throw new NotAuthenticated();
  } else if (!throw_error && !session) {
    return null;
  }
  const user = new User(session?.user as User);
  event.context.user = user;
  return user;
};
