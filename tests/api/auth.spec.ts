import { TestContext, beforeAll, beforeEach, describe, expect, test } from 'vitest'
import { constances } from '../definitions/define';
import useServerSignIn from '../../server/utils/use-server-sign-in'
import { IAppTestContext } from '../setup';


interface LocalTestContext {
    auth?: {
        status: number;
        data: any;
        JWT: string | undefined;
        sessionCookie: string | undefined;
    }
}

beforeEach<LocalTestContext>(async (ctx) => {
    if(!ctx.auth){
        const auth = await useServerSignIn(constances.auth.rootLogs);
        ctx.auth = auth;    
    }
})


test<LocalTestContext>('[AUTH] should have token of root user', async (ctx) => {
    expect(ctx.auth?.status).toBe(200);
    expect(ctx.auth?.sessionCookie).toBeTypeOf('string');
    expect(ctx.auth?.JWT).toBeTypeOf('string');
});


test('[AUTH] should forbid log in with fake ids', async (ctx) => {
    try {
        await useServerSignIn(constances.auth.wrongLogs);
    } catch (err: any) {
        expect(err.status).toBe(401)
    }
});