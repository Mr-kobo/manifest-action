import fs from "fs";
import _ from "lodash";
import { ObjectId } from "mongodb";
import mongoose, { Model, Document } from "mongoose";
import seedDev from "~~/seeds/default";
import seedStaging from "~~/seeds/staging";
import seedProd from "~~/seeds/production";

export default async () => {
	console.log('\x1b[36m%s\x1b[0m', "[SEEDS] Initializing seed.");
	try {
		let entries: { model: Model<any>, primary: string, seed: any[] }[] = [];

		// reccup le bon json
		switch (process.env.NODE_ENV) {
			case "production":
				if (!!process.env.STAGING) {
					entries = seedStaging();
				} else {
					entries = seedProd();	
				}
				break;

			default:
				entries = seedDev();
				break;
		}

		for (const entry of entries) {

			const Model = entry.model;
			const datas = entry.seed;
			for (const data of datas) {
				if (entry.primary) {
					await Model.findOneAndUpdate({ [entry.primary]: data[entry.primary] || new ObjectId() }, data, { upsert: true }); // no hook :/ (auth-meta)
				} else {
					console.error(`[SEEDS] Error for primary key: ${entry.primary} on service: ${entry.model.modelName}`);
				}
			}
		}
		console.log('\x1b[32m%s\x1b[0m', "[SEEDS] Seed planted.");
	} catch (e) {
		console.error('\x1b[31m%s\x1b[0m', "[SEEDS][ERROR] ", e);
	}
};
