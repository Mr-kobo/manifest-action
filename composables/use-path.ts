import type { RawLocation, RouteLocation } from '@intlify/vue-router-bridge';

export default (route: RawLocation | RouteLocation, locale?: string | undefined) => useNuxtApp().$localePath(route, locale);