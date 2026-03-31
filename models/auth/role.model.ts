import _ from "lodash";
import { IRole, Roles, roleValidator } from "~~/schemas/auth/role.schema";
import AModel from "../core/model";
import { AppPermissions } from "~/app.config";

export class Role extends AModel<IRole> implements IRole {
	name: string;
	power: number;
	profiles: string[];

	constructor(data: Partial<IRole> = {}) {
		super(roleValidator, Roles, "/api/roles");
		// Initilize data on Daughter level
		this.init(data);
	}

	/**
 * Check if user have the profile
 * @param profiles string 
 */
	hasProfile(profiles?: string | string[]): { success: boolean, message?: string; } {
		if (this.profiles.includes(AppPermissions.ROOT)) {
			return { success: true };
		}
		if (!profiles) {
			return { success: true };
		}

		if (_.isArray(profiles)) {
			return this.profiles.some(element => profiles.includes(element)) ? { success: true } : { success: false, message: 'error.not_good_profile' };
		} else {
			return this.profiles.includes(profiles) ? { success: true } : { success: false, message: 'error.not_good_profile' };
		}
	}

	/**
	 * Check if user have enought power
	 * @param power: number | 0 
	 */
	hasPower(power: number | 0): { success: boolean, message?: string; } {
		return (this.power || 0) >= power ? { success: true } : { success: false, message: 'error.not_enough_power' };
	}

	/**
	 * Check if user have enought power and profile
	 * @param power: number | 0 
	 * @param profil string 
	 */
	hasPowerAndProfile(power: number | 0, profil: string) {
		const message = [];
		const checkProfile = this.hasProfile(profil);
		const checkPower = this.hasPower(power);

		if (checkProfile.success == false) message.push(checkProfile.message);
		if (checkPower.success == false) message.push(checkPower.message);

		if (message.length === 0) return { success: true, message: '' };
		return { success: false, message: message.join('##') };
	}

}