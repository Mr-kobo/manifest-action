import _ from "lodash";
import defaultConfig from "../config/default";
import stagingConfig from '../config/staging';
import productionConfig from "../config/production";
import localConfig from "../config/local";

import defaultServerlessConfig from "../config/serverless/default.serverless";
import liveServerlessConfig from "../config/serverless/live.serverless";
import productionServerlessConfig from "../config/serverless/production.serverless";

export default () => {
    console.log('\x1b[36m%s\x1b[0m', '[USE CONFIG]');
    if (process.env.NODE_ENV)
        console.log('\x1b[36m%s\x1b[0m', '[ENV]', process.env.NODE_ENV);
    if (process.env.LIVE)
        console.log('\x1b[36m%s\x1b[0m', '[LIVE]', process.env.LIVE);
    if (process.env.STAGING)
        console.log('\x1b[36m%s\x1b[0m', '[STAGING]', process.env.STAGING);
    if (process.env.LOCAL)
        console.log('\x1b[36m%s\x1b[0m', '[LOCAL]', process.env.LOCAL);

    let config = (() => {
        if (!!process.env.SERVERLESS) {
            if (process.env.NODE_ENV === "production") {
                return _.merge(defaultConfig, productionServerlessConfig);
            } else if (process.env.NODE_ENV === "test" || process.env.LIVE === "true") {
                return _.merge(defaultConfig, liveServerlessConfig);
            }
            return _.merge(defaultConfig, defaultServerlessConfig);
        }

        if (!!process.env.LOCAL) {
            return _.merge(defaultConfig, localConfig);
        } else
        if (!!process.env.STAGING) {
            return _.merge(defaultConfig, stagingConfig);
        } else if (process.env.NODE_ENV === "production") {
            return _.merge(defaultConfig, productionConfig);
        }
        return defaultConfig;
    })();
    console.log('\x1b[36m%s\x1b[0m', JSON.stringify(config));
    // console.groupEnd();
    return config;
};