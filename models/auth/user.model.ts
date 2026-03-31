import _ from "lodash";
import { IUser, Users, userValidator } from "~~/schemas/auth/user.schema";
import AModel from "../core/model";
import { Role } from "./role.model";
import { Types } from "mongoose";

export class User extends AModel<IUser> implements IUser {
	// tell the model the also build sub-members of the object
	protected $build = {
		role: Role, emailVerified: Date,
	};
	identifier: string;
	email?: string;
	phone?: string;
	profil: {
		firstname: string;
		lastname: string;
		avatar: string;
        position: string
	};
	password: string;
	roleID: string | Types.ObjectId;
	role?: Role;
	preferences: {
		stayLog: boolean,
		enable2FA: boolean,
		locale: string,
	} = {
		enable2FA: false,
		stayLog: true,
		locale: 'fr',
	};
	contact: 'email' | 'sms';
	contacts: ('email' | 'sms')[]; 
	emailVerified?: Date;


	get fullname() {
		return (this.profil?.firstname)? this.profil?.firstname + ' ' + this.profil?.lastname: 'John Doe';
	}
	get initials() {
		return (this.profil?.firstname)? this.profil?.firstname[0] + this.profil?.lastname[0]: 'John Doe';
	}

	/**
	 * 
	 * @param data 
	 * @param defaultValues set whenever initializing all member with defaultValues or undefined, default is undefined  
	 */
	constructor(data: Partial<IUser> = {}) {
		super(userValidator, Users, "/api/users");
		
		// Initilize data on Daughter level
		this.init(data);
	}
}