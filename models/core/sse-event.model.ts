import _ from "lodash";
import AModel from "./model";
import { ISSEEvent, SSEEvent, sseEventValidator } from "~/schemas/core/sse-event";

export enum ServerEventsType {
    PROGRESS = 'progress'
}

export class sseEvent extends AModel<ISSEEvent> implements ISSEEvent {

	eventId: string;
	type: ServerEventsType;
	data: object;
	done: boolean;
	slug: string;

	constructor(data: Partial<ISSEEvent> = {}) {
		super(sseEventValidator, SSEEvent, "/api/sse/event");
		// Initilize data on Daughter level
		this.init(data);
	}

}