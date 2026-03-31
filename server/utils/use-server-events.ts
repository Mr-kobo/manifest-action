
import { H3Event } from 'h3';
import { v4 as uuid } from 'uuid';
import { sse_hooks } from '../api/sse/hookable';
import { SSEEvent } from '~/schemas/core/sse-event';

export enum ServerEventsType {
    PROGRESS = 'progress'
}

export interface IServerSentEvent {
    sse_handler: {
        type: ServerEventsType,
        id: string,
        done?: boolean,
        error?: Error,
        data?: any;
    };
}

export default () => {

    /**
     * Initializes a server-sent event.
     * also set event.context.sse_job_id to the unique ID of the server-sent event.
     * 
     * @param event - The H3Event object representing the event.
     * @param type - The type of server event, defaults to ServerEventsType.PROGRESS.
     * @returns A promise that resolves to the unique ID of the server-sent event.
     */
    const init = async (event: H3Event, type: ServerEventsType = ServerEventsType.PROGRESS, slug?: string) => {
        const id = uuid().toString();
        await SSEEvent.create({ eventId: id, type, data: null, done: false, slug });
        await send(event, JSON.stringify({ sse_handler: { type, id } } as IServerSentEvent), 'application/json');
        event.context.sse_job_id = id;
        return id;
    };

    /**
     * Emits data to a server-sent event.
     * 
     * @param id - The unique ID of the server-sent event.
     * @param data - The data to be emitted.
     */
    const emit = (event: H3Event, data: any) => {
        if (!event.context.sse_job_id) {
            throw new Error('Server-sent event not initialized please call init() first');
        }
        sse_hooks.callHook(`sse:${event.context.sse_job_id}`, data);
    };

    /**
     * Closes a server-sent event.
     * 
     * @param id - The unique ID of the server-sent event.
     * @param data - The data to be sent before closing the event.
     */
    const error = (event: H3Event, error: Error) => {
        if (!event.context.sse_job_id) {
            throw new Error('Server-sent event not initialized please call init() first');
        }
        sse_hooks.callHook(`sse:${event.context.sse_job_id}`, { sse_handler: { done: true, error } } as IServerSentEvent);
    };


    /**
     * Closes a server-sent event.
     * 
     * @param id - The unique ID of the server-sent event.
     * @param data - The data to be sent before closing the event.
     */
    const close = async (event: H3Event, data: any) => {
        if (!event.context.sse_job_id) {
            throw new Error('Server-sent event not initialized please call init() first');
        }
        sse_hooks.callHook(`sse:${event.context.sse_job_id}`, { sse_handler: { done: true, data } } as IServerSentEvent);
        // use persistence of the event to store the final data and mark it as done
        await SSEEvent.findOneAndUpdate({ eventId: event.context.sse_job_id }, { data, done: true });
    };

    return { init, emit, close, error };
};