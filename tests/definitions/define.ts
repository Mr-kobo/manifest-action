import _ from "lodash";
import { prod_constances } from "./define.prod";

/**
 *
 *  DEFINE TEST VARIABLES   
 * 
 */
const default_constances = {
    //#region Authentication 
    auth: {
        rootLogs: {
            identifier: "developper.superdev@gmail.com",
            password: "superdev",
        },
        wrongLogs: {
            identifier: "developper.superdev@gmail.com",
            password: "WRONG_AND_FAKE_PASSWORD",
        }
    }
    //#endregion
}


// Merge default with prod
function testConstantes(defaultValues: any, prodValues: any) {
    let constances = defaultValues;
    if (process.env.NODE_ENV === "production") {
        constances = _.assign(defaultValues, prodValues);
    }
    return constances;
}

const constances = testConstantes(default_constances, prod_constances); 
export {
    constances
}