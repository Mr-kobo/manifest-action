export default {
	production: true,
	debug: true,
	mongodb: "mongodb://localhost:27017/boilerplate",
	uploads: {
		path: '/server/assets/uploads',
		uri: '/api/files'
	},
	public: {
		env: 'prod',
		origin: "http://localhost:3000",
		host: "http://localhost:3000",
	},
};
