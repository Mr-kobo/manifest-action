import { H3Event } from 'h3';
import { Forbidden } from '~/models/core/errors.model';


export function disallow(event: H3Event) {
    throw new Forbidden({ message: "error.method_disallowed" })
}