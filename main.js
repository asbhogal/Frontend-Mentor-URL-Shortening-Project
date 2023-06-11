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
			<h2 class="input">${inputURL}</h2>
			<h2 class="url">${urlLink}</h2>
			<button class="btn copy-btn"> Copy It </button>
		</div>
			`;
  } catch (err) {
    err = "Sorry, not sure what happened there!";
    console.log(err);
  }
}

// Honestly dont like this solution. But, hmm, lets just get her done, and then come back and refactor, apply a different solution.

// document
// 	.querySelector(".shortend-urls-container")
// 	.addEventListener("click", (e) => {
// 		e.preventDefault();
// 		e.target.addEventListener("click", () => {
// 			// #PANDEMONIUM
// 			console.log(e.target);
// 			document.querySelector(".copy-btn").classList.add("copied--confirm");
// 		});
// 	});

// Hot garbage!

// Clipboard API + testings.
//Holy heck; its an API /facepalm it works with a promise too... ah ofc. Read more before you start again. X~

const shortenLinkBtn = document.querySelector(".shorten-link-btn");

shortenLinkBtn.addEventListener("click", callAPI);
