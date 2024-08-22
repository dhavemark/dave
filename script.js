// Add this before your encrypt() and decrypt() functions
document.querySelectorAll(".btn").forEach((button) => {
  button.addEventListener("click", function (event) {
    const formControls = button
      .closest(".col-md-6")
      .querySelectorAll(".form-control");
    formControls.forEach((input) => {
      if (!input.checkValidity()) {
        input.classList.add("is-invalid");
      } else {
        input.classList.remove("is-invalid");
      }
    });
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const toggleButton = document.getElementById("mode-toggle");
  const body = document.body;
  const icon = toggleButton.querySelector("i");

  if (localStorage.getItem("nightMode") === "true") {
    body.classList.add("night-mode");
    toggleButton.innerHTML = '<i class="bi bi-cloud-sun-fill"></i> Light  ';
  }

  toggleButton.addEventListener("click", function () {
    body.classList.toggle("night-mode");

    if (body.classList.contains("night-mode")) {
      toggleButton.innerHTML = '<i class="bi bi-cloud-sun-fill"></i> Light  ';
      localStorage.setItem("nightMode", "true");
    } else {
      toggleButton.innerHTML = '<i class="bi bi-moon-stars-fill"></i> Night  ';
      localStorage.setItem("nightMode", "false");
    }
  });
});

const amplitudeSequence = [+3, -2, +1, -4];

function encrypt() {
  const plaintext = document.getElementById("plaintext").value.toUpperCase();
  const encryptedText = processText(plaintext, "encrypt");
  document.getElementById("output").textContent = `${encryptedText}`;
}

function decrypt() {
  const ciphertext = document.getElementById("ciphertext").value.toUpperCase();
  const decryptedText = processText(ciphertext, "decrypt");
  document.getElementById("output").textContent = `${decryptedText}`;
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

function startVoiceCommand() {
  const recognition = new (window.SpeechRecognition ||
    window.webkitSpeechRecognition)();
  recognition.lang = "en-US";
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.start();

  recognition.onresult = function (event) {
    const command = event.results[0][0].transcript.toLowerCase();

    if (command.includes("encrypt")) {
      encrypt();
    } else if (command.includes("decrypt")) {
      decrypt();
    } else {
      document.getElementById("plaintext").value = command;
    }
  };

  recognition.onerror = function (event) {
    alert("Voice command error: " + event.error);
  };
}

function copyToClipboard() {
  // Get the text content from the output div
  const outputText = document.getElementById("output").innerText;

  // Create a temporary textarea element to hold the text to be copied
  const tempTextarea = document.createElement("textarea");
  tempTextarea.value = outputText;
  document.body.appendChild(tempTextarea);

  // Select the text and copy it to the clipboard
  tempTextarea.select();
  document.execCommand("copy");

  // Remove the temporary textarea element
  document.body.removeChild(tempTextarea);

  // Change the button text and icon to show "Copied"
  const copyButton = document.getElementById("copyButton");
  copyButton.innerHTML = '<i class="bi bi-check me-1"></i>Copied!';

  // Reset the button text and icon after a short delay (e.g., 2 seconds)
  setTimeout(() => {
    copyButton.innerHTML = '<i class="bi bi-copy me-1"></i>Copy';
  }, 1000);
}
