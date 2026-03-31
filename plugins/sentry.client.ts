import { defineNuxtPlugin } from '#app';
import * as pkg from '~/package.json';
import * as Sentry from '@sentry/browser';
import { Integrations } from '@sentry/tracing';

export default defineNuxtPlugin((nuxtApp) => {
    const release = `nuxtboilerplate@${pkg.version}`;
    const environment = nuxtApp.$config.public.env;
    if(nuxtApp.$config.public.sentry) {
        Sentry.init({
            dsn: nuxtApp.$config.public.sentry,
            release,
            environment,
            integrations: [new Integrations.BrowserTracing()],
            sampleRate: 1,
            tracesSampleRate: 1
        });
    }
});
