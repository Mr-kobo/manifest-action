import { createHooks } from "hookable";

export interface ServerSentEvent {
    [key: string]: <T, R>(data: T) => R | void
}
export const sse_hooks = createHooks<ServerSentEvent>()