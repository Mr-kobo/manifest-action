import { ObjectId } from "mongodb";
import _ from "lodash";

//#region APP 
export interface IAppParams {
    events: any;
    navbar: string | null;
    inProgressAuth: string | null;
    topbar: {
        show: boolean,
        title: string;
        back: boolean;
    };
}
//#endregion

//#region QUERY
export type Query = Record<string, any>;
/**
 * Define a Query 
 */
export type QueryParams = {
    headers?: Record<string, string>,
    query?: Query;
    path?: string;
};
//#endregion

// #region Define a page in the pagination

export interface IPage {
    index: number,
    pages: number,
    limit: number,
    total: number,
    skip?:number
}

export interface IPaginated<T> {
    page: IPage;
    data: T[];
}

export class Paginated<T> implements IPaginated<T> {
    page: IPage;
    data: T[];
    constructor(data: IPaginated<T>) {
        _.assign(this, data);
    }
}
//#endregion
