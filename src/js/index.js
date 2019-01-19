import Search from "./models/Search";
import Recipe from "./models/Recipe";
import List from "./models/List";
import Likes from "./models/Likes";
import * as recipeView from "./views/recipeView";
import * as searchView from "./views/searchView";
import * as listView from "./views/listView";
import * as likeView from "./views/likeView";
import {
	elements,
	renderLoader,
	clearLoader,
	elementStrings
} from "./views/base";
/*
Global state of the app
Search Object
Current recipe object
shopping list object
liked recipes
*/
const state = {};

const controlSearch = async () => {
	const query = searchView.getInput();

	if (query) {
		//clear previous results
		searchView.clearResults();
		//load loader
		renderLoader(elements.searchResults);
		state.search = new Search(query);
		//prepare UI for the result
		try {
			//do search
			await state.search.getResults();
			//clear loader
			clearLoader();
			//clear input
			searchView.clearInput();
			//render results on UI
			searchView.renderRecipes(state.search.recipes);
		} catch (err) {
			//clear loader
			clearLoader();
			alert(err);
		}
		//add link listener
		//addLinkListener();
	}
};
elements.searchForm.addEventListener("submit", e => {
	e.preventDefault();
	controlSearch();
});

elements.searchResPages.addEventListener("click", e => {
	const btn = e.target.closest(`.${elementStrings.button}`);

	if (btn) {
		//clear previous results
		searchView.clearResults();

		const gotoPage = parseInt(btn.dataset.goto, 10);

		searchView.renderRecipes(state.search.recipes, gotoPage);
	}
});
/*
//alternative way to respond to anchor click
const addLinkListener = () => {
	document.querySelectorAll(`.${elementStrings.link}`).forEach(el => {
		el.addEventListener("click", e => {
			const anc = e.target.closest(`.${elementStrings.link}`);
			console.log(anc);
			var id = anc.getAttribute("href").replace("#", "");
			console.log("id:", id);
		});
	});
};
*/

const controlRecipe = async () => {
	const id = window.location.hash.replace("#", "");
	if (id) {
		//prepare UI
		recipeView.clearRecipe();
		renderLoader(elements.recipe);
		//highlight.select
		searchView.highlightSelected(id);
		//create new recipe object
		state.recipe = new Recipe(id);
		try {
			//get recipe
			await state.recipe.getRecipe();
			//calculate serving and time
			state.recipe.calcTime();
			state.recipe.calcServings();
			state.recipe.parseIngredients();
			clearLoader();

			if (state.likes) {
				const isLiked = state.likes ? state.likes.isLiked(id) : false;
				recipeView.renderRecipe(state.recipe, isLiked);
				likeView.toggleLikeMenu(state.likes.getNumLikes());
			} else {
				recipeView.renderRecipe(state.recipe);
				likeView.toggleLikeMenu(0);
			}
			//render recipe
		} catch (err) {
			console.log(err);
		}
	}
};
window.addEventListener("hashchange", controlRecipe);

//load Likes from localStorage
const loadLikes = () => {
	state.likes = new Likes();
	state.likes.restoreData();

	likeView.toggleLikeMenu(state.likes.getNumLikes());

	state.likes.likes.forEach(like => likeView.renderLike(like));
};
//window load event
const windowLoad = () => {
	loadLikes();
	controlRecipe();
};
window.addEventListener("load", windowLoad);

/*["hashchange", "load"].forEach(event =>
	window.addEventListener(event, controlRecipe)
);*/

const controlList = () => {
	if (!state.list) {
		state.list = new List();
	}
	//add each ingredient to the list
	state.recipe.ingredients.forEach(el => {
		const item = state.list.addItem(el.count, el.unit, el.ingredient);
		listView.renderItem(item);
	});
};
//Like controller
const controlLike = () => {
	if (!state.likes) {
		state.likes = new Likes();
	}

	const currentID = state.recipe.id;

	//user has not yet liked current recipe
	if (!state.likes.isLiked(currentID)) {
		//Add like to the state
		const newLike = state.likes.addLike(
			currentID,
			state.recipe.title,
			state.recipe.author,
			state.recipe.img
		);
		//toggle the like button
		likeView.toggleLikeBtn(true);
		//Add like to UI list
		likeView.renderLike(newLike);
	} else {
		//remove like to the state
		state.likes.deleteLike(currentID);
		//toggle the like button
		likeView.toggleLikeBtn(false);
		//remove like to UI list
		likeView.deleteLike(currentID);
	}
	likeView.toggleLikeMenu(state.likes.getNumLikes());
	//save likes to browser
	state.likes.persistData();
};

//handling recipe button clicks
elements.recipe.addEventListener("click", e => {
	if (e.target.matches(".btn-decrease, .btn-decrease *")) {
		if (state.recipe.servings > 1) {
			state.recipe.updateServings("dec");
			recipeView.updateServingsIngredients(state.recipe);
		}
	} else if (e.target.matches(".btn-increase, .btn-increase *")) {
		state.recipe.updateServings("ins");
		recipeView.updateServingsIngredients(state.recipe);
	} else if (e.target.matches(".recipe__btn--add, .recipe__btn--add *")) {
		controlList();
	} else if (e.target.matches(".recipe__love, .recipe__love *")) {
		//Like controller
		controlLike();
	}
});

//
elements.shopping.addEventListener("click", e => {
	const id = e.target.closest(".shopping__item").dataset.itemid;
	if (e.target.matches(".shopping__delete, .shopping__delete *")) {
		listView.deleteItem(id);
		state.list.deleteItem(id);
	} else if (e.target.matches(".shopping__count-value")) {
		const val = parseFloat(e.target.value, 10);

		if (val > 0) {
			state.list.updateCount(id, val);
		}
	}
});
