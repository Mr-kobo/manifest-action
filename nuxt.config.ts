// https://nuxt.com/docs/api/configuration/nuxt-config
// import config from "config";
import _ from "lodash";
import useConfig from "./utils/use-config";
import path from "path";

const config = useConfig();
process.env.AUTH_ORIGIN = config.public.origin;
process.env.NEXTAUTH_URL = config.public.host;
process.env.NEXTAUTH_SECRET = config.authentication.secret;
export default defineNuxtConfig({
    vite: {
        server: {
            hmr: !process.env.SERVERLESS
        }
    },
    experimental: {
        renderJsonPayloads: false, // first fix to the POJO bug (disable the devalue render JSON)
    },
    runtimeConfig: config,
    components: true,
    modules: ["@nuxt/ui", "@nuxtjs/i18n", "@sidebase/nuxt-auth", "@nuxt/content"],
    nitro: {
        storage: {
            uploads: {
                driver: 'fs',
                base: path.join(path.resolve(), config.uploads.path)
            },
            templates: {
                driver: 'fs',
                base: './server/assets/templates'
            }
        },
        plugins: ["~/server/plugins/0_mongoose.ts", "~/server/plugins/1_seed.ts", "~/server/plugins/2_errors.ts"],
        hooks: {
            "dev:reload": () => require("sharp"),
        },
        compatibilityDate: '2024-11-28'
    },
    ssr: false,
    auth: {
        baseURL: `${config.public.host}/api/auth`,
        isEnabled: true,
        provider: {
            type: "authjs",
        }
    },
    ui: {
        theme: {
            colors: ['primary', 'secondary', 'accent', 'info', 'success', 'warning', 'error']
        }
    },
    css: ["~/assets/css/theme.css", "~/assets/css/icons.css"],
    i18n: {
        customRoutes: "page", // config: use i18nRoutes, pages : no i18n routes
        defaultLocale: "fr",
        langDir: "locales/",
        locales: [
            {
                code: "en",
                file: "en.js"
            },
            {
                code: "fr",
                file: "fr.js"
            }
        ],
        detectBrowserLanguage: {
            useCookie: true,
            cookieKey: "i18n_redirected",
            redirectOn: "root"
        },
        strategy: "prefix_and_default",       
    },
    routeRules: {
        "/": { ssr: true },
    },
    devtools: {
        enabled: config.debug
    },
    spaLoadingTemplate: 'spa-loading-template.html',
    compatibilityDate: "2024-11-28",
});

process.on("unhandledRejection", (reason, p) => console.error("Unhandled Rejection at: Promise ", p, reason));