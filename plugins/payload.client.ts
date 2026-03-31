import _ from "lodash"
import AModel from "~~/models/core/model"

export default definePayloadPlugin((nuxtApp) => {
    // console.log('[PLUGIN PAYLOAD]');

    definePayloadReducer('AModelPayload', payload => {
        for (let key in payload.data) {
            payload.data[key] = recursiveReducer(payload.data[key]);   
        }
        return payload
    })
    definePayloadReviver('AModelPayload', (data: string) => {
        // console.log('PAYLOAD REVIVER', data)
        return data;
    })
})

function recursiveReducer(obj: any) {
    if (_.isArray(obj)) {
        for (let i = 0; i < obj.length; i++) {
           obj[i] = recursiveReducer(obj[i]);
        }
        return obj;
    } else if (obj instanceof AModel) {
        return obj.toJSON();
    } else if (_.isObject(obj)) {
        for (let key in obj) {
            (obj as any)[key] = recursiveReducer((obj as any)[key])
        }
        return obj;
    }
}
