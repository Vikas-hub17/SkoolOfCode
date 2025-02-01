document.addEventListener("DOMContentLoaded", function () {
    const apiKeyInput = document.getElementById("apiKeyInput");
    const sendButton = document.getElementById("sendButton");
    const userPrompt = document.getElementById("userPrompt");
    const responseArea = document.getElementById("responseArea");
    const avatars = document.querySelectorAll(".avatar");
    const selectedAvatarText = document.getElementById("selectedAvatar");
    let selectedAvatar = null;
  
    // Handle avatar selection.
    avatars.forEach(avatar => {
      avatar.addEventListener("click", function () {
        selectedAvatar = avatar.dataset.name;
        selectedAvatarText.innerText = "Selected Avatar: " + selectedAvatar;
      });
    });
  
    // Function to refresh animations on an element
    function refreshAnimation(element) {
      element.style.animation = 'none';
      element.offsetHeight; // Trigger reflow
      element.style.animation = '';
    }
  
    // Send the user prompt to the backend API.
    sendButton.addEventListener("click", function () {
      const prompt = userPrompt.value;
      const api_key = apiKeyInput.value.trim();
      if (!prompt) {
        alert("Please type a question for Python Pal!");
        return;
      }
  
      responseArea.innerHTML = "Python Pal is thinking...";
      refreshAnimation(responseArea); // Re-run animation
  
      fetch("/api/tutor", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          prompt: prompt,
          api_key: api_key
        })
      })
      .then(response => response.json())
      .then(data => {
        if (data.error) {
          responseArea.innerHTML = "Error: " + data.error;
        } else {
          // Prepend avatar information if one was selected.
          const avatarPrefix = selectedAvatar ? `<strong>${selectedAvatar} says:</strong> ` : "";
          responseArea.innerHTML = avatarPrefix + data.answer;
        }
        refreshAnimation(responseArea);
      })
      .catch(error => {
        responseArea.innerHTML = "Error: " + error;
        refreshAnimation(responseArea);
      });
    });
  
    // Mini Challenge: Validate the solution that prints "Hello, World!".
    const submitChallenge = document.getElementById("submitChallenge");
    const challengeAnswer = document.getElementById("challengeAnswer");
    const challengeFeedback = document.getElementById("challengeFeedback");
  
    submitChallenge.addEventListener("click", function () {
      const answer = challengeAnswer.value;
      // A simple check: Does the answer contain a print statement with "Hello, World!"?
      if (answer.includes('print') && answer.includes("Hello, World")) {
        challengeFeedback.innerHTML = "Great job! You solved the challenge!";
      } else {
        challengeFeedback.innerHTML = "Not quite right. Hint: Use the print() function to display 'Hello, World!'.";
      }
      refreshAnimation(challengeFeedback);
    });
  });
  