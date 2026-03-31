import { test } from 'vitest'
import { constances } from '../definitions/define';
import useServerSignIn from '../../server/utils/use-server-sign-in'

export default () => {
    test('[AUTH] should log in with root', async (data) => {
        await useServerSignIn(constances.auth.rootLogs);
    });

    test.fails('[AUTH] should forbid log in with fake ids', async (data) => {
        await useServerSignIn(constances.auth.wrongRootLogs);
    });
}


