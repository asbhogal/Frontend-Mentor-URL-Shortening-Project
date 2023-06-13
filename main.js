import "./src/styles/index.scss";

const hamburgerMenu = document.querySelector(".hamburger-menu");
const shortenLinkBtn = document.querySelector(".shorten-link-btn");

hamburgerMenu.addEventListener("click", function () {
	console.log("clicked");
	const navList = document.querySelector(".nav-list");
	if (navList.classList.contains("hidden")) {
		navList.classList.remove("hidden");
	} else {
		navList.classList.add("hidden");
	}
});

// The API.

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
			<h2 class="input">${inputURL}</h2>
			<h2 class="url">${urlLink}</h2>
			<button class="btn copy-btn"> 
			Copy It 
			</button>
		</div>
			`;
	} catch (err) {
		err = "Sorry, not sure what happened there!";
		console.log(err);
	}
	// Clear the input box
	document.querySelector(".link-input").value = "";
}

shortenLinkBtn.addEventListener("click", callAPI);

/// Clipboard API
// Text copying.
const urlBoxContainer = document.querySelector(".shortend-urls-container");

urlBoxContainer.addEventListener("click", (event) => {
	const clicked = event.target;
	const urlToCopy = clicked.previousElementSibling.innerText;

	if (clicked.classList.contains("copy-btn")) {
		navigator.clipboard
			.writeText(urlToCopy)
			.then(() => {
				// Temp styling and changed on copy, its 6-am and my brain is just not having this "sleep deprivation" anymore. But, I am happy it works. Will work on it more.
				clicked.innerText = "Copied";
				clicked.style.backgroundColor = "#3b3054";
			})
			.catch((err) => {
				console.error(`Error copying text to clipboard: ${err}`);
			});
	}
});
