import { getServerSession } from "#auth";
import { H3Event } from 'h3';
import _ from "lodash";


export default async (event: H3Event) => {
    const session = await getServerSession(event);

    // IMPORTANT : We have to manually remove the multiple headers Content-Type added by getServerSession witch cause HAVOC in production -> in Chrome. 
    // thanks @sidebase/nust-auth for this PURE HORSE SHIT !
    const headers = getResponseHeaders(event);
    const contentType: string | number | undefined = (_.isArray(headers['content-type']) ? headers['content-type'].shift() : headers['content-type']) || undefined
    if (contentType) {
        setResponseHeader(event, 'content-type', contentType);
    }

    return session;
};