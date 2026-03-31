import _ from "lodash";
import { Paginated } from "~~/models/core/common.model";

/**
 * useProtect : escape given members of an object or an array of object
 */
export default <T = any>(object: any | any[] | Paginated<any>, ...members: string[]): Partial<T> => {
	if (!object) {
		return object;
	}

	if (object instanceof Paginated<any>) {
		for (let member of members) {
			object.data = object.data.map((o: any) => protect(o, member));
		}
	} else if (_.isArray(object)) {
		for (let member of members) {
			object = object.map((o: any) => protect(o, member));
		}
	} else {
		for (let member of members) {
			object = protect(object, member);
		}
	}

	function protect(object: any, member: string) {
		return _.set(object, member, undefined);
	}

	return object;
};
