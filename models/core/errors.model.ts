import { NuxtError } from "#app";
import { H3Error } from "h3";
import _ from "lodash";


class AppError implements NuxtError {
    name: string;
    message: string;
    stack?: string | undefined;
    statusCode: number;
    fatal: boolean;
    unhandled: boolean;
    statusMessage?: string | undefined;
    data?: any;
    cause?: unknown;
    
    constructor(err: string | Partial<NuxtError> | undefined = undefined, msg: string, code: number) {
        const message = _.isString(err) ? err : (err?.message || msg || 'error.general_error'); 
        let error: Partial<NuxtError> = {
            message,
            statusCode: _.get(err, 'statusCode') || code || 500,
            statusMessage: message,
        };
        error = createError(_.assign({}, error));
        _.assign(this, error);
    }
    
    toJSON(): Pick<H3Error, "data" | "message" | "statusCode" | "statusMessage"> {
        return {
            data: this.data,
            message: this.message, 
            statusCode: this.statusCode,
            statusMessage: this.statusMessage,
        }
    }

}


export interface Errors {
    BadRequest: BadRequest;
    NotAuthenticated: NotAuthenticated;
    PaymentError: PaymentError;
    Forbidden: Forbidden;
    NotFound: NotFound;
    MethodNotAllowed: MethodNotAllowed;
    NotAcceptable: NotAcceptable;
    Timeout: Timeout;
    Conflict: Conflict;
    LengthRequired: LengthRequired;
    Unprocessable: Unprocessable;
    TooManyRequests: TooManyRequests;
    GeneralError: GeneralError;
    NotImplemented: NotImplemented;
    BadGateway: BadGateway;
    Unavailable: Unavailable;
    400: BadRequest;
    401: NotAuthenticated;
    402: PaymentError;
    403: Forbidden;
    404: NotFound;
    405: MethodNotAllowed;
    406: NotAcceptable;
    408: Timeout;
    409: Conflict;
    411: LengthRequired;
    422: Unprocessable;
    429: TooManyRequests;
    500: GeneralError;
    501: NotImplemented;
    502: BadGateway;
    503: Unavailable;
}



export class BadRequest extends AppError {
    constructor(err?: string | Partial<NuxtError> | undefined) {
        super(err, 'error.bad_request', 400);
    }
}

export class NotAuthenticated extends AppError {
    constructor(err?: string | Partial<NuxtError> | undefined,) {
        super(err, 'error.not_authenticated', 401);
    }
}

export class PaymentError extends AppError {
    constructor(err?: string | Partial<NuxtError> | undefined,) {
        super(err, 'error.payment_error', 402);
    }
}

export class Forbidden extends AppError {
    constructor(err?: string | Partial<NuxtError> | undefined,) {
        super(err, 'error.forbidden', 403);
    }
}

export class NotFound extends AppError {
    constructor(err?: string | Partial<NuxtError> | undefined,) {
        super(err, 'error.not_found', 404);
    }
}

export class MethodNotAllowed extends AppError {
    constructor(err?: string | Partial<NuxtError> | undefined,) {
        super(err, 'error.not_allowed', 405);
    }
}

export class NotAcceptable extends AppError {
    constructor(err?: string | Partial<NuxtError> | undefined,) {
        super(err, 'error.not_acceptable', 406);
    }
}

export class Timeout extends AppError {
    constructor(err?: string | Partial<NuxtError> | undefined,) {
        super(err, 'error.timeout', 408);
    }
}

export class Conflict extends AppError {
    constructor(err?: string | Partial<NuxtError> | undefined,) {
        super(err, 'error.conflict', 409);
    }
}

export class LengthRequired extends AppError {
    constructor(err?: string | Partial<NuxtError> | undefined,) {
        super(err, 'error.lenghtRequired', 411);
    }
}

export class Unprocessable extends AppError {
    constructor(err?: string | Partial<NuxtError> | undefined,) {
        super(err, 'error.unprocessable', 422);
    }
}

export class TooManyRequests extends AppError {
    constructor(err?: string | Partial<NuxtError> | undefined,) {
        super(err, 'error.too_many_requests', 422);
    }
}

export class GeneralError extends AppError {
    constructor(err?: string | Partial<NuxtError> | undefined,) {
        super(err, 'error.general_error', 500);
    }
}

export class NotImplemented extends AppError {
    constructor(err?: string | Partial<NuxtError> | undefined,) {
        super(err, 'error.not_implemented', 501);
    }
}

export class BadGateway extends AppError {
    constructor(err?: string | Partial<NuxtError> | undefined,) {
        super(err, 'error.bad_gateway', 502);
    }
}

export class Unavailable extends AppError {
    constructor(err?: string | Partial<NuxtError> | undefined,) {
        super(err, 'error.unavailable', 503);
    }
}