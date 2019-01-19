export default class Like {
	constructor() {
		this.likes = [];
	}

	addLike(id, title, author, img) {
		const like = {
			id,
			title,
			author,
			img
		};

		this.likes.push(like);
		return like;
	}

	deleteLike(id) {
		const index = this.likes.findIndex(el => el.id === id);
		this.likes.splice(index, 1);
	}

	isLiked(id) {
		return this.likes.findIndex(el => el.id === id) >= 0;
	}

	getNumLikes() {
		return this.likes.length;
	}

	persistData() {
		localStorage.removeItem("likes");
		localStorage.setItem("likes", JSON.stringify(this.likes));
	}

	restoreData() {
		const storage = JSON.parse(localStorage.getItem("likes"));
		if (storage) this.likes = storage.likes;
	}
}
