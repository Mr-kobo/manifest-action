import _ from "lodash";
import setCookie from 'set-cookie-parser';
import useConfig from "../../utils/use-config";
import axios from "axios";
const config = useConfig();

export default async (credentials: { identifier: string, password: string }) => {
    try {
        // Ask for csrfToken 
        const { data: csrfData, headers: csrfHeaders } = await axios.get(`${config.public.host}/api/auth/csrf`);
        const { csrfToken } = csrfData;
        if (!csrfToken || !csrfHeaders || !csrfHeaders["set-cookie"]) {
            new Error('Member \'csrfToken\' missing');
        }
        // check for token in headers: 
        const cookie = setCookie.parseString(csrfHeaders["set-cookie"].join(' '), { decodeValues: false })

        if (cookie.name !== 'next-auth.csrf-token' || !csrfToken) {
            throw new Error('[CSRF ERROR] no token provided')
        }

        const token = csrfToken;

        var details: any = {
            'identifier': credentials.identifier,
            'password': credentials.password,
            // 'redirect', 'false',
            'csrfToken': token,
            'json': 'true'
        };

        var formBody: any = [];
        for (var property in details) {
            var encodedKey = encodeURIComponent(property);
            var encodedValue = encodeURIComponent(details[property]);
            formBody.push(encodedKey + "=" + encodedValue);
        }
        formBody = formBody.join("&");

        const { status, statusText, data, headers } = await axios.post(`${config.public.host}/api/auth/callback/credentials`, formBody, {
            headers: {
                'Cookie': `next-auth.csrf-token=${cookie.value};`,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        let JWT = undefined;
        let sessionCookie = undefined;  
        if (headers['set-cookie']) {
            sessionCookie = headers['set-cookie'].filter(s => s.startsWith('next-auth.session-token'))[0];
            const c = setCookie.parseString(sessionCookie, { decodeValues: false });
            JWT = c.value;
            
        }

        return { status, data, JWT, sessionCookie };
    } catch (err: any) {
        if(err.toJSON)
            throw err.toJSON();
        else throw err;
    }
};
