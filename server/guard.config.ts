import { IGuard } from "./utils/use-guard";


/*
    dataValidator : yup schema
    methods: 'POST','PUT','GET','DELETE', '*'
    auth: need to be logged true false
    profils: if logged autorized profil (OR)
*/
const rules: IGuard[] = [
    // Exemple of generalized rule
    // {
    //     methods: ["*"],
    //     path: "/api/users",
    //     auth: false,
    //     profiles: []
    // },
]

export default rules;