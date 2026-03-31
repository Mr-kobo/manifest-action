import { Model } from "mongoose";
import { Roles } from "~~/schemas/auth/role.schema";
import { Users } from "~~/schemas/auth/user.schema";
import { AppPermissions } from "~/app.config";

export default (): { model: Model<any>, primary: string, seed: any[]; }[] => {

  return [
    {
      model: Roles,
      primary: '_id',
      seed: [
        {
          _id: "642ae022e55cdda59e73a001",
          name: "root",
          power: 1024,
          profiles: [AppPermissions.ROOT],
        },
      ]
    },
    {
      model: Users,
      primary: '_id',
      seed: [
        {
          _id: "644283acfa74ca4f23b44d80",
          identifier: "developper.superdev@gmail.com",
          password: "superdev",
          roleID: "642ae022e55cdda59e73a001",
          companyID: "65378fcbfb8651ba5d4e90aa",
          profil: {
            firstname: 'Dave',
            lastname: 'Hopper',
            avatar: 'https://randomuser.me/api/portraits/women/5.jpg',
            position: 'med'
          }
        }
      ]
    },
  ];
};
