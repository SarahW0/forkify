import { elements, elementStrings } from "./base";
export const getInput = () => elements.searchInput.value;

const renderRecipe = recipe => {
	const markup = `
        <li>
        <a class="results__link" href="#${recipe.recipe_id}">
            <figure class="results__fig">
                
                <img src="${recipe.image_url}" alt="${recipe.title}">
            </figure>
            <div class="results__data">
                <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
                <p class="results__author">${recipe.publisher}</p>
            </div>
        </a>
        </li>      
   `;
	elements.searchResultList.insertAdjacentHTML("beforeend", markup);
};

export const limitRecipeTitle = (title, limit = 17) => {
	let cutTitle = "";
	if (title.length > limit) {
		title.split(" ").reduce((acc, curr) => {
			if (acc + curr.length < limit) {
				cutTitle = cutTitle + " " + curr;
			}
			return acc + curr.length;
		}, 0);
		return cutTitle + "...";
	}
	return title;
};
//type:prev or next
const createButton = (page, type) =>
	type === "prev"
		? `<button class="btn-inline results__btn--prev" data-goto=${page - 1}>
                <svg class="search__icon">
                    <use href="img/icons.svg#icon-triangle-left"></use>
                </svg>
                <span>Page ${page - 1}</span>
            </button>`
		: `
            <button class="btn-inline results__btn--next" data-goto=${page + 1}>
                <span>Page ${page + 1}</span>
                <svg class="search__icon">
                    <use href="img/icons.svg#icon-triangle-right"></use>
                </svg>
            </button>`;

const renderButtons = (page, numResults, resPerPage) => {
	const pages = Math.ceil(numResults / resPerPage);
	if (pages <= 1) return;

	let button;
	if (page === 1) {
		//first page: only show button to go to the next page
		button = createButton(1, "next");
	} else if (page === pages) {
		//last page: only show button to go to the pre page
		button = createButton(page, "prev");
	} else {
		//other pages: both buttons
		button = `${createButton(page, "prev")}
		         ${createButton(page, "next")}`;
	}

	elements.searchResPages.insertAdjacentHTML("beforeend", button);
};

export const renderRecipes = (recipes, page = 1, resPerPage = 10) => {
	const start = (page - 1) * resPerPage;
	const end = start + resPerPage;

	recipes.slice(start, end).forEach(renderRecipe);
	//render buttons
	renderButtons(page, recipes.length, resPerPage);
};

export const clearInput = () => {
	elements.searchInput.value = "";
};

export const clearResults = () => {
	elements.searchResultList.innerHTML = "";
	elements.searchResPages.innerHTML = "";
};

export const highlightSelected = id => {
	const resultArr = Array.from(
		document.querySelectorAll(`.${elementStrings.link}`)
	);
	resultArr.forEach(el => {
		el.classList.remove(`${elementStrings.link}--active`);
	});
	let link = document.querySelector(`.results__link[href="#${id}"]`);
	if (link) {
		link.classList.add(`${elementStrings.link}--active`);
	}
};
