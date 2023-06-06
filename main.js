import "./src/styles/index.scss";

const hamburgerMenu = document.querySelector(".hamburger-menu");

hamburgerMenu.addEventListener("click", function () {
	console.log("clicked");
	const navList = document.querySelector(".nav-list");
	if (navList.classList.contains("hidden")) {
		navList.classList.remove("hidden");
	} else {
		navList.classList.add("hidden");
	}
});
