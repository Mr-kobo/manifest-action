import _ from "lodash";
import type {
  Adapter,
  AdapterUser,
  AdapterSession,
  VerificationToken as AdapterVerificationToken,
} from "next-auth/adapters";
import { SessionData } from "~~/schemas/auth/session-data.schema";
import { AuthTokens } from "~~/schemas/auth/auth-token.schema";
import { User } from "~~/models/auth/user.model";
import { Id } from "~~/models/core/base.model";
import { IUser } from "~~/schemas/auth/user.schema";
import { MethodNotAllowed } from "~/models/core/errors.model";
import useModels from "./use-models";

export default (): Adapter => {
  const { save, retrieve, remove } = useModels();
  return {
    async createUser(u: Partial<IUser>) {
      const data = await save(new User(u));
      return useProtect(data?.toJSON(), 'password') as any;
    },
    async getUser(_id: Id) {
      try {
        const data = await retrieve(new User({ _id }));
        // console.log('getUser', data?.value?.toJSON());
        return data?.toJSON() as any;
      } catch (err) {
        return null;
      }
    },
    async getUserByEmail(identifier: string) {
      try {
        const data = await retrieve(new User(), { identifier });
        return data?.toJSON() as any;
      } catch (e) {
        return null;
      }
    },
    async getUserByAccount({ providerAccountId, provider }: { providerAccountId: string, provider: string; }) {
      try {
        switch (provider) {
          case 'email':
            const email = await retrieve(new User(), { identifier: providerAccountId });
            // console.log('getUserByAccount', email?.value?.toJSON());
            return email?.toJSON() as any;
          default:
            const data = await retrieve(new User({ _id: providerAccountId }));
            return data?.toJSON() as any;
        }
      } catch (err) {
        return null;
      }
    },
    async updateUser(u: any) {
      const data = await save(new User(_.assign(u, { _id: u.id })));
      return useProtect(data?.toJSON(), 'password') as any;
    },
    async deleteUser(_id: Id) {
      const data = await remove(new User({ _id }));
      return data;
    },
    async linkAccount(account: any) {
      console.log('LINK ACCOUNT');
      throw new MethodNotAllowed('Methods not implemented yet by this custom adapter');
    },
    async unlinkAccount(account: any) {
      // const { providerAccountId, provider } = account;
      throw new MethodNotAllowed('Methods not implemented yet by this custom adapter');
    },
    async createSession(data: any) {
      console.log("createSession: ", data);
      const session = await SessionData.create(data);
      return session;
    },
    async getSessionAndUser(sessionToken: any) {
      // Get Session
      const session = await SessionData.findOne({ sessionToken }, {}, { upsert: true, new: true });
      if (!session) return null;
      // Find User
      try {
        const data = await retrieve(new User({ _id: session.userId }));
        const user = data?.toJSON() as any;
        // const user = await adaptorMethods.getUser(session.userId);
        if (!user) return null;
        return { user, session };
      } catch (err) {
        return null;
      }
    },
    async updateSession(data: any) {
      const { id, ...restData } = data;
      const session = await SessionData.findByIdAndUpdate(id, restData, {
        new: true,
        runValidators: true,
      });
      return session;
    },
    async deleteSession(sessionToken: any) {
      console.log("deleteSession: ", sessionToken);
      const session = await SessionData.findOneAndDelete({ sessionToken });
      return session;
    },
    async createVerificationToken({ identifier, expires, token }: { identifier: string, expires: Date, token: string; }) {
      const t = await AuthTokens.create({ identifier, expires, token });
      return t.toJSON() as any;
    },
    async useVerificationToken({ identifier, token }: { identifier: string, token: string; }) {
      const t: any = await AuthTokens.findOneAndDelete({ identifier, token });
      if (!t?.token) {
        return null;
      }
      delete t._id;
      return t.toJSON() as any;
    },
  } as any;
};

// async linkAccount(account) {
//   throw new MethodNotAllowed('Methods not implemented yet by this custom adapter');
// },
// async unlinkAccount({ providerAccountId, provider }) {
//   throw new MethodNotAllowed('Methods not implemented yet by this custom adapter');
// },
// async createSession({ sessionToken, userId, expires }) {
//   throw new MethodNotAllowed('Methods not implemented yet by this custom adapter');
// },
// async getSessionAndUser(sessionToken: string) {
//   throw new MethodNotAllowed('Methods not implemented yet by this custom adapter');
// },
// async updateSession({ sessionToken }) {
//   throw new MethodNotAllowed('Methods not implemented yet by this custom adapter');
// },
// async deleteSession(sessionToken) {
//   throw new MethodNotAllowed('Methods not implemented yet by this custom adapter');
// },