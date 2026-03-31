export default {
	production: true,
	debug: false,
	mongodb: "mongodb://mongo/boilerplate",
	uploads: {
		path: '/server/assets/uploads',
		uri: '/api/files'
	},
	public: {
		env: 'prod',
		origin: "",
		host: "",
	},
	notifications: {
		mailersend: {
			key: "",
			from: { 
				email:"",
				name: ""
			}
		},
		sms: {
			from: ''
		}
	},
	authentication: {
		secret: "",
		salt: "",
		flags: {
			userOnLogCreation: true
		},
		oauth: {
			google: {
				clientId: "",
				secret: "",
			},
		},
	},
};
