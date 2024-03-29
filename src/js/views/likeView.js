import { elements } from "./base";
import { limitRecipeTitle } from "./searchView";

export const toggleLikeBtn = isLiked => {
	/*
               <button class="recipe__love">
                    <svg class="header__likes">
                        <use href="img/icons.svg#icon-heart-outlined"></use>
                    </svg>
                </button>        
    */
	const iconString = isLiked ? "icon-heart" : "icon-heart-outlined";

	const svgParent = document
		.querySelector(".recipe__love use")
		.setAttribute("href", `img/icons.svg#${iconString}`);
};

export const toggleLikeMenu = numLikes => {
	elements.likesMenu.style.visibility = numLikes > 0 ? "visible" : "hidden";
};

export const renderLike = like => {
	const markup = `
            <li>
            <a class="likes__link" href="#${like.id}">
                <figure class="likes__fig">
                    <img src="${like.img}" alt="Test">
                </figure>
                <div class="likes__data">
                    <h4 class="likes__name">${limitRecipeTitle(like.title)}</h4>
                    <p class="likes__author">${like.author}</p>
                </div>
            </a>
            </li>    
    
    `;

	elements.likeList.insertAdjacentHTML("beforeend", markup);
};

export const deleteLike = id => {
	const list = document.querySelector(`.likes__link[href="#${id}"]`)
		.parentElement;
	list.parentElement.removeChild(list);
};
