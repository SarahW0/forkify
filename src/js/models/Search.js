import axios from "axios";
import { key, baseURL } from "../config";

export default class Search {
	constructor(query) {
		this.query = query;
	}

	async getResults() {
		try {
			const res = await axios(`${baseURL}/search?key=${key}&q=${this.query}`);
			if (res.data.error) {
				alert("ERROR: " + res.data.error);
			} else {
				this.recipes = res.data.recipes;
				console.log(this.recipes);
			}
		} catch (error) {
			alert(error);
		}
	}
}
