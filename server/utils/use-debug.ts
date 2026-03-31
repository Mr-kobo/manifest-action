import { H3Event } from "h3";

export default async (event: H3Event) => {
    console.group("\x1b[31m%s\x1b[0m", '[DEBUG HOOK]', getRequestURL(event).href);
    console.log("\x1b[30m%s\x1b[0m", '   ¤ METHOD --> ', getMethod(event));
    console.log("\x1b[30m%s\x1b[0m", '   ¤ QUERY --> ', getQuery(event));
    console.log("\x1b[30m%s\x1b[0m", '   ¤ DATA --> ', await readBody(event));
    console.log("\x1b[30m%s\x1b[0m", '   ¤ HEADERS --> ', getRequestHeaders(event));
    console.groupEnd();
};
