export const elementStrings = {
	loader: "loader",
	button: "btn-inline",
	link: "results__link"
};
export const elements = {
	searchInput: document.querySelector(".search__field"),
	searchForm: document.querySelector(".search"),
	searchResultList: document.querySelector(".results__list"),
	searchResults: document.querySelector(".results"),
	searchResPages: document.querySelector(".results__pages"),
	recipe: document.querySelector(".recipe"),
	shopping: document.querySelector(".shopping__list"),
	likesMenu: document.querySelector(".likes__field"),
	likeList: document.querySelector(".likes__list")
};

export const renderLoader = parent => {
	const loader = `
    <div class="${elementStrings.loader}">
       <svg>
          <use href="img/icons.svg#icon-cw"></use>
       </svg>
    </div>    
    `;
	parent.insertAdjacentHTML("afterbegin", loader);
};

export const clearLoader = () => {
	//const loader = elements.searchLoader;
	const loader = document.querySelector(`.${elementStrings.loader}`);
	if (loader) {
		loader.parentElement.removeChild(loader);
	}
};
