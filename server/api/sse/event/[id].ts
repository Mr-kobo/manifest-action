import hooks from "./hooks";
import { sseEvent } from "~/models/core/sse-event.model";
import { SSEEvent } from "~/schemas/core/sse-event";

export default useRest(SSEEvent, sseEvent, hooks);