import { setup } from '@nuxt/test-utils'

export interface IAppTestContext {
    auth?: {
        JWT: string,
        sessionCookie: string
    }
}

// setup.js
if (!(globalThis as any).isTestAppInit) {
    console.log('STARTING SETUP')
    await setup({
        // test context options
        rootDir: '..',
        server: true,
        port: 3000,
        build: false,
        runner: 'vitest',
        dev: true, // process.env.NODE_ENV !== 'production',
    });


    console.log('Finish setup');
    (globalThis as any).isTestAppInit = true;
}


