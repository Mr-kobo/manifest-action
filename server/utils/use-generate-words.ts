import fs from "fs";
import wordsListPath from "word-list";

export default async (keyLength: number) => {
	const wordsList: string[] = fs.readFileSync(wordsListPath).toString().split("\n");

	const words: string[] = [];

	for (let i = 0; i < keyLength; i++) {
		words.push(wordsList[Math.floor(Math.random() * wordsList.length)]);
	}

	if (words.length > 0) {
		return words.join("-");
	} else {
		return "";
	}
};
