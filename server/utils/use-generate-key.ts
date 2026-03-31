const chars: string = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

export default (keyLength: number) => {
	let toReturn: string = "";

	for (let i = 0; i < keyLength; i++) {
		toReturn += chars[Math.floor(Math.random() * chars.length)];
	}

	return toReturn;
};
