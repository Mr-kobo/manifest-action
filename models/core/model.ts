import { BaseModel } from "./base.model";

// let model: typeof BaseModel;
// if (isNitro()) {
//     model = ServerModel
// } else {
//     model = ClientModel
// }
// export default class AModel<T extends Object> extends model<T> { };

export default class AModel<T extends Object> extends BaseModel<T> { };
