import "./src/styles/index.scss";

// Global variables
const hamburgerMenu = document.querySelector(".hamburger-menu");
const shortenLinkBtn = document.querySelector(".shorten-link-btn");
const container = document.querySelector(".shortend-urls-container");
container.innerHTML = getHTML();

// Event listeners
shortenLinkBtn.addEventListener("click", callAPI);
hamburgerMenu.addEventListener("click", function () {
  const navList = document.querySelector(".nav-list");
  navList.classList.toggle("hidden"); // A much cleaner way is to use the toggle() function to toggle the "hidden" class of the ".nav-list". If the class is present,it will be removed. if it isn't present, it will be added.
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
      const urlPackage = { original: inputURL, short: urlLink };

      //
      document.querySelector(".error").style.display = "none";
      document.querySelector("#url-input").style.border = "2px solid green";

      container.innerHTML += `
			<div class="shortend-url">
				<h2 class="input">${inputURL}</h2>
				<h2 class="url">${urlLink}</h2>
				<button class="btn copy-btn">
				Copy It
				</button>
			</div>
				`;
      linksInStorage(urlPackage);
    } catch (err) {
      err = "Sorry, not sure what happened there!";
      document.querySelector(".error").style.display = "block";
      document.querySelector("#url-input").style.border = "2px solid red";
    }
  } else {
    // Not entirely sure how to have this display, it keeps being out of sync in terms of styling. I dont have an idea as of yet.Besides flex hackiness, I have done enough butcher shop work though today, aha.
  }

  // Clear the input box
  document.querySelector("#url-input").value = "";
  getHTML();
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
function linksInStorage(link) {
  let linkHistory = JSON.parse(localStorage.getItem("linkies")) || [];
  linkHistory.push(link);
  localStorage.setItem("linkies", JSON.stringify(linkHistory));
  return linkHistory;
}

function getHTML() {
  let content = linksInStorage();
  let html = "";
  content.forEach((item) => {
    if (item) {
      html += `<div class="shortend-url">
			<h2 class="input">${item.original}</h2>
			<h2 class="url">${item.short}</h2>
			<button class="btn copy-btn"> 
			Copy It 
			</button>
		</div>
			`;
    }
  });
  return html;
}
