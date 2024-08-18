document.addEventListener("DOMContentLoaded", function () {
  const toggleButton = document.getElementById("mode-toggle");
  const body = document.body;
  const icon = toggleButton.querySelector("i");

  if (localStorage.getItem("nightMode") === "true") {
    body.classList.add("night-mode");
    toggleButton.innerHTML = '<i class="bi bi-cloud-sun-fill"></i>  Light Mode';
  }

  toggleButton.addEventListener("click", function () {
    body.classList.toggle("night-mode");

    if (body.classList.contains("night-mode")) {
      toggleButton.innerHTML =
        '<i class="bi bi-cloud-sun-fill"></i> Light Mode';
      localStorage.setItem("nightMode", "true");
    } else {
      toggleButton.innerHTML =
        '<i class="bi bi-moon-stars-fill"></i> Night Mode';
      localStorage.setItem("nightMode", "false");
    }
  });
});

const amplitudeSequence = [+3, -2, +1, -4];

function encrypt() {
  const plaintext = document.getElementById("plaintext").value.toUpperCase();
  const encryptedText = processText(plaintext, "encrypt");
  document.getElementById(
    "output"
  ).textContent = `Ciphertext: ${encryptedText}`;
}

function decrypt() {
  const ciphertext = document.getElementById("ciphertext").value.toUpperCase();
  const decryptedText = processText(ciphertext, "decrypt");
  document.getElementById("output").textContent = `Plaintext: ${decryptedText}`;
}

function processText(text, mode) {
  let result = "";
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const isLetter = /[A-Z]/.test(char);
    if (isLetter) {
      const position = char.charCodeAt(0) - 65; // A = 0, B = 1, ...
      const shift = amplitudeSequence[i % amplitudeSequence.length];
      let newPosition;
      if (mode === "encrypt") {
        newPosition = (position + shift + 26) % 26;
      } else {
        newPosition = (position - shift + 26) % 26;
      }
      result += String.fromCharCode(newPosition + 65);
    } else {
      result += char;
    }
  }
  return result;
}
