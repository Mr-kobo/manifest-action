export default {
	production: true,
	debug: true,
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
};
