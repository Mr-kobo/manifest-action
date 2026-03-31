import { BadRequest } from "~/models/core/errors.model";
import { sse_hooks } from "./hookable";
import { SSEEvent } from "~/schemas/core/sse-event";
import { H3Event } from 'h3';


export default defineEventHandler(async (event) => {

    const params = getRouterParams(event);

    setHeader(event, 'content-type', 'text/event-stream');
    setHeader(event, 'cache-control', 'no-cache');
    setHeader(event, 'connection', 'keep-alive');
    setResponseStatus(event, 200);

    if (!params['id']) {
        throw new BadRequest('error.missing_id');
    }

    const id = params['id'];

    const close = () => {
        event.node.res.end();
    };

    const writeSSEMessage = (event: H3Event, id: string, data: any) => {
        event.node.res.write(`id: ${id}\n`);
        event.node.res.write(`data: ${JSON.stringify(data)}\n\n`);
        event.node.res.flushHeaders();
    };

    sse_hooks.hook(`sse:${id}`, (data: any) => {
        writeSSEMessage(event, id, data);
    });

    event._handled = true;
    event.node.req.on("close", close);

    // Check if event is already done
    const sse_event = await SSEEvent.findOne({ eventId: id });
    if (sse_event?.done) {
        writeSSEMessage(event, id, { sse_handler: sse_event });
        await SSEEvent.deleteOne({ eventId: id });
    }
});