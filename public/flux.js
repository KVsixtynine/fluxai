// Image handle
const apiBaseUrl =
  "https://3f36b9cf-487c-4459-b8ee-47b05e06791b-00-2pomz5f2oiix3.janeway.replit.dev";
const form = document.querySelector("form");
const prompt = document.querySelector('textarea[type="text"]');
const ratio = document.querySelector("#ratio");
const numsImg = document.querySelector("#numsImg");
const typeImg = document.querySelector("#typeImg");
const myRange = document.getElementById("myRange");

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const promptValue = prompt.value;
  const ratioValue = ratio.value;
  const numsImgValue = numsImg.value;
  const typeImgValue = typeImg.value;
  const seedValue = myRange.value;
  console.log(ratioValue, numsImgValue, typeImgValue, seedValue);

  generateFlux(promptValue, ratioValue, numsImgValue, typeImgValue, seedValue)
    .then((imageUrl) => {
      if (imageUrl) {
        displayImage(imageUrl, promptValue);
      } else {
        console.error("No image generated");
      }
    })
    .catch((error) => {
      console.error("Error generating image: ", error);
    });
});

// Validate the prompt and make a request to server
async function generateFlux(prompt, ratio, numsImg, typeImg, seedValue) {
  const _prompt = prompt.trim();
  console.log(prompt, ratio, numsImg, typeImg, seedValue);
  if (!_prompt) {
    alert("Please enter a prompt and select a style.");
    return;
  }
  try {
    /*const response = await fetch(
        `${apiBaseUrl}/generate/${_prompt}/${_ratio}/${_numsImg}/${_typeImg}/${_seedValue}`,
      );*/
    const response = await fetch(`${apiBaseUrl}/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: _prompt,
        ratio,
        numsImg,
        typeImg,
        seedValue,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      console.log(data);
      const imageUrls = data.imageUrl;
      console.log(imageUrls[0]);
      return imageUrls[0];
    } else {
      const errorData = await response.json(); // Try to get detailed error data
      const errorMessage = errorData.error || response.statusText;
      handleError(errorMessage);
      return [];
    }
  } catch (error) {
    handleError("An unexpected error occur.");
  }
}

function handleError(errorMessage) {
  console.error("Error generating images:", errorMessage);
  alert(`An error occurred: ${errorMessage}`);
  // Additional error handling or actions can be added here
}

function displayImage(imageUrl, prompt) {
  const generatedImg = document.createElement("div");
  generatedImg.className = "generated-image";
  const imageElement = document.createElement("img");
  imageElement.src = imageUrl;
  const p = document.createElement("p");
  p.textContent = prompt;
  generatedImg.appendChild(imageElement);
  generatedImg.appendChild(p);
  const containerDiv = document.querySelector("#container");
  containerDiv.prepend(generatedImg);
}

var slider = document.getElementById("myRange");
var seedValue = document.getElementById("seedValue");
seedValue.innerHTML += slider.value; // Display the default slider value

// Update the current slider value (each time you drag the slider handle)
slider.oninput = function () {
  seedValue.innerHTML = "Seed: " + this.value;
};
