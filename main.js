import "./src/styles/index.scss";

// Global variables
const hamburgerMenu = document.querySelector(".hamburger-menu");
const shortenLinkBtn = document.querySelector(".shorten-link-btn");

// Event listeners
shortenLinkBtn.addEventListener("click", callAPI);
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
	const inputURL = document.querySelector("#url-input").value;
	const container = document.querySelector(".shortend-urls-container");

	// This if statement checks if the url being entered is valid, by using the function declared below and passing in the urlLink (aka input) as the parameter which is used to test against the condition in the function below
	if (checkURL(inputURL)) {
		try {
			const response = await fetch(
				`https://api.shrtco.de/v2/shorten?url=${inputURL}/`
			);
			const data = await response.json();
			const urlLink = "https://www." + data.result.short_link;

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
	} else {
		// Not entirely sure how to have this display, it keeps being out of sync in terms of styling. I dont have an idea as of yet.Besides flex hackiness, I have done enough butcher shop work though today, aha.
		console.log("Well, not?");
	}

	// Clear the input box
	document.querySelector("#url-input").value = "";
}

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

// Function to test for validity of the url using URL constructor.

function checkURL(string) {
	let url;

	try {
		url = new URL(string);
	} catch (_) {
		return false;
	}

	return url.protocol === "http:" || url.protocol === "https:";
}

//
