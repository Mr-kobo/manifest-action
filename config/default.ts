export default {
	production: false,
	debug: true,
	mongodb: "mongodb://localhost:27017/boilerplate",
	uploads: {
		path: '/server/assets/uploads',
		uri: '/api/files'
	},
	notifications: {
		mailersend: {
			key: "",
			from: {
				email: "",
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
	public: {
		env: 'dev',
		origin: 'http://localhost:4200',
		host: "http://localhost:4200",
		pagination: {
			default: 10,
			max: 50,
		},
		zodI18n: {
			dateFormat: "dd/MM/yyyy",
		}
	}
};
