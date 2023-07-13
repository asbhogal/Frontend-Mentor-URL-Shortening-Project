import "./src/styles/index.scss";

// Global variables
const hamburgerMenu = document.querySelector(".hamburger-menu");
const shortenLinkBtn = document.querySelector(".shorten-link-btn");
const linkInput = document.querySelector(".link-input"); // added variable for link input to append an event listener too (see below)
const container = document.querySelector(".shortend-urls-container");
container.innerHTML = getHTML();

// Event listeners
shortenLinkBtn.addEventListener("click", callAPI);
linkInput.addEventListener("keyup", function (e) {
  e.keyCode === 13 && (e.preventDefault(), callAPI()); // added an event listener for when the user presses 'enter' on their keyboard - a common UX feature. This listens for the respective key value for the enter button, then calls the function callAPI
});
hamburgerMenu.addEventListener("click", function () {
  const navList = document.querySelector(".nav-list");
  navList.classList.toggle("hidden"); // A much cleaner way is to use the toggle() function to toggle the "hidden" class of the ".nav-list". If the class is present,it will be removed. if it isn't present, it will be added.
});

linkInput.addEventListener("input", resetErrorStyling); // an event listener I've added which watches for input changes on the linkInput then runs the resetErrorStyling function (manually added - see below)

// The API.
async function callAPI() {
  const inputURL = document.querySelector("#url-input").value;
  // const container = document.querySelector(".shortend-urls-container"); omitted as this is declared globally above

  // This if statement checks if the url being entered is valid, by using the function declared below and passing in the urlLink (aka input) as the parameter which is used to test against the condition in the function below

  /* if (!checkURL(inputURL)) {
    // re-incorporated the conditional check to see if the url is valid when tested against the regex expression in the checkURL() function. if it isn't valid, the showErrorStyling() function is called, and the
    showErrorStyling();
    return;
  } */

  const isValidURL = checkURLValidation(inputURL);

  !isValidURL && showErrorStyling(); // this uses the logical && operator to evaluate the first operand (ie. left side of the operator) to see if it is 'truthy'. If it is, it proceeds to parse the right side of the operator. If it is falsy, it does not action the right side, and continues with the callAPI() function

  /* it's basically the equivalent to:

  if (!isValidURL) {
    showErrorStyling();
    return;
  }

  */

  /*

  In the callAPI() function, the result of validateURL(inputURL) is stored in the isValidURL variable. If isValidURL is false, the error styling is applied using showErrorStyling() and the function returns, preventing the callAPI() function from continuing to function. This ensures that the calls are only made when the URL's entered are valid, preventing unnecessary requests.
  
  */

  try {
    checkURLValidation(inputURL);
    const response = await fetch(
      `https://api.shrtco.de/v2/shorten?url=${inputURL}/`
    );
    const data = await response.json();
    const urlLink = `https://www.${data.result.short_link}`; // replaced concatenated string value with template literals for ES6 consistency
    const urlPackage = { original: inputURL, short: urlLink };

    // document.querySelector(".error").style.display = "none";
    // document.querySelector("#url-input").style.border = "2px solid green";

    // above styling omitted as these have been moved to the function removeErrorStyling()

    resetErrorStyling(); // see below for this function

    container.innerHTML += getHTMLTemplate(inputURL, urlLink);

    /* container.innerHTML += `
		<div class="shortend-url">
        	<div class="shortend-left-section">
				<a class="input">${inputURL}</a>
        	</div>
        	<div class="shortend-right-section">
          		<a class="url">${urlLink}</a>
          			<button class="btn copy-btn">Copy</button>
        	</div>
		</div>`; */ // omitted as this template will be combined with the one below into a function called getHTMLTemplate() which handles both the inputURL and urlLink as parameters, to avoid duplication of the HMTL template - see below

    // updated this to match the template in the getHTML() function below (so both stored links and new generated ones follow the same styling)

    // changed the h2 content to a tags to make them more semantically correct - should avoid multiple h2 tags and use them for subheadings

    linksInStorage(urlPackage);
  } catch (err) {
    console.log(err); // added logging the error to console - will also help with debugging
    // err = "Sorry, not sure what happened there!"; // omitted as doesn't show in the console log
    // document.querySelector(".error").style.display = "block";
    // document.querySelector("#url-input").style.border = "2px solid red";
    // document.querySelector("#url-input") .style.setProperty("--color", "#f46262");
    // when the catch is run, the --color variable is passed red for the placeholder text
    // Oh, I have never seen this before. Very cool.

    // all three styling above have been omitted and subsequently added to the function showErrorStyling() - see below
    showErrorStyling();
  } // temporarily removed if-else as code inside wasn't running. Will review this - this function is therefore likely to change in future commits

  // Clear the input box
  document.querySelector("#url-input").value = "";
  getHTML();
}

// Function to test for validity of the url using URL constructor.
function checkURLValidation(url) {
  // renamed for greater clarity on the functions purpose
  const urlPattern = /^(https?:\/\/)?([a-z0-9-]+\.)+[a-z]{2,}(\/.*)?$/i;
  return urlPattern.test(url);
  /* let url;

  try {
    url = new URL(string);
  } catch (_) {
    return false;
  }

  return url.protocol === "http:" || url.protocol === "https:"; */

  // when checking the validity of an entry, in this case a URL, it is standard practice to use regular expressions to check if the entry matches a defined pattern which deems it 'acceptable' or not. This uses the test() method and returns a boolean value (true or false) indicating whether the string is a valid URL according to the pattern.

  // regex is difficult to understand at first - I'll send you notes about it in detail, which should (hopefully) help with the side studying in it (if you haven't started regex yet, I can send you a good freeCodeCamp tutorial)

  // I literally cannot even understand that url pattern. I dont know what I am looking at there. So, that info will be helpful, I will begin the process just as soon as I finish typing this pointless sentence of course.
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
        clicked.innerText = "Copied!"; // slight modification to this just to reflect mockups active state - addition of !
        clicked.style.backgroundColor = "#3b3054";
        clicked.style.transition = " background-color .5s ease-in-out";
        //
      })
      .catch((err) => {
        console.error(`Error copying text to clipboard: ${err}`);
      });
  }
});

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
      html += getHTMLTemplate(item.original, item.short);
    }
  });
  return html;
}

function getHTMLTemplate(original, short) {
  return `
        <div class="shortend-url">
        	<div class="shortend-left-section">
			<a class="input">${original}</a>
          </div>
          <div class="shortend-right-section">
			<a class="url" href=${short}>${short}</a> 
			<button class="btn copy-btn"> Copy </button>
          </div>
		</div>
			`;
}

// added href value to allow users to also click the generated shortened link

/* 

The function getHTMLTemplate() above accepts the 'original' and 'short' parameters passed to it from the 'try' block and returns the template containing the original and shortened values. This is called in two places:

1. In the callAPI() function - getURLTemplate(inputURL, urlLink) is used to generate the HTML template for the new URL entry. This template is then appended to the container element using container.innerHTML += getURLTemplate(inputURL, urlLink).

2. In the getHTML() function - for each entry using forEach(), the function calls getURLTemplate(item.original, item.short) to generate the corresponding HTML template. The generated HTML templates are concatenated together to form a single string, which is then returned as the HTML content for the container.

This means we only have to code the HTML template once and call it in these two places, ensuring consistency (as opposed to two separate templates which may have discrepancies), both when a new shortened URL is added and when the HTML is updated based on the stored URLs

*/

// OLD NOTE - I've modified the html content above for the getHTML() function to match the mockup better. The respective styling is in the index.scss file (this will likely change location as I move things around).

// the button text for the getHTML() and callAPI() functions have been altered to better reflect mockup

// changed the h2 content to a tags to make them more semantically correct - should avoid multiple h2 tags and use them for subheadings

function resetErrorStyling() {
  const errorElement = document.querySelector(".error");
  const urlInputElement = document.querySelector("#url-input");

  errorElement.style.display = "none";
  urlInputElement.style.border = "2px solid green";
  urlInputElement.style.removeProperty("--color");
}

// the function above, when called resets the error styling. This uses the styling you previously added further up in the try segment of the async-await call, it's just been moved to this function to keep the code more modular and maintainable. The third line removes the color property that's added to the placeholder text (ie. the red color) and subsequently defaults it back to the original placeholder color value

function showErrorStyling() {
  const errorElement = document.querySelector(".error");
  const urlInputElement = document.querySelector("#url-input");

  errorElement.style.display = "block";
  urlInputElement.style.border = "2px solid red";
  urlInputElement.style.setProperty("--color", "#f46262");
}

// this function does the opposite to the one above - it sets the relevant styling to the input when an invalid URL is entered, or when an empty value is attempted to be submitted. This takes the styling you applied in the 'catch' section of the callAPI() function and moves it here
