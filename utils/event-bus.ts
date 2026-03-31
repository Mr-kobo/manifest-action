// import { StringChain } from "lodash";

// class EventBus{
//     events: any = {};

//     getHandlers(eventName: string) {
//         return this.events[eventName];
//     }

//     on(eventName: string, fn: Function) {
//         if(!this.getHandlers(eventName)) this.events[eventName] = [];
//         this.events[eventName].push(fn);
//     }

//     off(eventName: StringChain) {
//         if(this.events[eventName]) {
//             this.events[eventName] = [];
//         }
//     }

//     emit(eventName: string, data: any) {
//         console.log('EMIT');
//         const handlers = this.getHandlers(eventName);
//         if(handlers) handlers.forEach(fn => fn(data));
//     }
// }

// const eventBus = new EventBus();

// export default eventBus;