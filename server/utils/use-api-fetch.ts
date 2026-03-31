import { H3Event } from 'h3';
import _ from 'lodash';
import isProduction from '~/utils/is-production';
import { NitroFetchOptions } from 'nitropack';

export default async (url: string, event: H3Event, _options?: NitroFetchOptions<any, any>) => {
    // const created = await Topics.create(topic);
    const cookies = parseCookies(event);

    const csrfKey = `${isProduction() ? '__Host-': ''}next-auth.csrf-token`;
    const tokenKey = `${isProduction() ? '__Secure-': ''}next-auth.session-token`;

    const csrf = cookies[csrfKey];
    const token = cookies[tokenKey];
    
    const cookie = `${csrfKey}=${csrf};${tokenKey}=${token};`;

    // console.log('COOKIE', cookie);

    const options = _.merge({}, _options || {}, { headers: { cookie } });

    // console.log('OPTIONS', options);

    return await $fetch(url, options);
};