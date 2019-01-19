import axios from "axios";
import { key, baseURL } from "../config";

export default class Recipe {
	constructor(id) {
		this.id = id;
	}

	async getRecipe() {
		try {
			const res = await axios(`${baseURL}/get?key=${key}&rId=${this.id}`);
			if (res.data.error) {
				alert("ERROR: " + res.data.error);
			} else {
				const { recipe } = res.data;
				console.log(recipe);

				this.title = recipe.title;
				this.author = recipe.publisher;
				this.img = recipe.image_url;
				this.url = recipe.source_url;
				this.ingredients = recipe.ingredients;
			}
		} catch (error) {
			alert(error);
		}
	}

	calcTime() {
		//assuming 15 mins needed for every 3 ingredients
		const numIng = this.ingredients.length;
		const periods = Math.ceil(numIng / 3);
		this.time = periods * 15;
	}

	calcServings() {
		this.servings = 4;
	}

	parseIngredients() {
		const unitsLong = [
			"tablespoons",
			"tablespoon",
			"ounces",
			"ounce",
			"teaspoons",
			"teaspoon",
			"cups",
			"pounds"
		];
		const unitShort = [
			"tbsp",
			"tbsp",
			"oz",
			"oz",
			"tsp",
			"tsp",
			"cup",
			"pound"
		];
		const units = [...unitShort, "g", "kg"];
		const newIngredients = this.ingredients.map(el => {
			let ingredient = el.toLowerCase();
			//uniform units
			unitsLong.forEach((unit, i) => {
				ingredient = ingredient.replace(unit, unitShort[i]);
			});
			//remove parentheses
			ingredient = ingredient.replace(/ *\([^)]*\) */g, " ");
			//parse ingredients into count, unit and ingredient
			const arrIng = ingredient.split(" ");
			const unitIndex = arrIng.findIndex(el2 => units.includes(el2));

			let objIng = {};
			if (unitIndex > -1) {
				//there is one unit

				objIng = {
					count: eval(arrIng.slice(0, unitIndex).join("")),
					unit: arrIng[unitIndex],
					ingredient: arrIng.slice(unitIndex + 1).join(" ")
				};
			} else if (parseInt(arrIng[0], 10)) {
				//there is no unit, but number
				objIng = {
					count: parseInt(arrIng[0], 10),
					unit: "",
					ingredient: arrIng.slice(1).join(" ")
				};
			} else {
				//there is no unit and no number
				objIng = {
					count: 1,
					unit: "",
					ingredient
				};
			}
			//

			return objIng;
		});
		this.ingredients = newIngredients;
	}

	updateServings(type) {
		//servings
		const newServings = type === "dec" ? this.servings - 1 : this.servings + 1;

		//ingredients
		this.ingredients.forEach(el => {
			el.count *= newServings / this.servings;
		});
		this.servings = newServings;
	}
}
