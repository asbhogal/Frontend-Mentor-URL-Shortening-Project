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

// The API stuff -- lets play! Be kind to me computer.

async function callAPI() {
	const inputURL = document.querySelector(".link-input").value;
	const container = document.querySelector(".shortend-urls-container");
	try {
		const response = await fetch(
			`https://api.shrtco.de/v2/shorten?url=${inputURL}/`
		);
		const data = await response.json();
		const urlLink = data.result.short_link;
		container.innerHTML += `
		<div class="shortend-url">
		<h2 class="url">${urlLink}</h2>
	</div>
		`;
	} catch (err) {
		err = "Sorry, not sure what happened there!";
		console.log(err);
	}
}

const shortenLinkBtn = document.querySelector(".shorten-link-btn");

shortenLinkBtn.addEventListener("click", callAPI);
