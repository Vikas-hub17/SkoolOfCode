document.addEventListener("DOMContentLoaded", function () {
  // ----------------------------
  // 1. Theme Switcher with UX Feedback
  // ----------------------------
  const toggleThemeButton = document.getElementById("toggleTheme");
  const themeLabel = document.getElementById("themeLabel");
  if (toggleThemeButton) {
    toggleThemeButton.addEventListener("change", function () {
      document.body.classList.toggle("dark-theme");
      // Update the label based on current theme:
      if (document.body.classList.contains("dark-theme")) {
        themeLabel.innerText = "Dark Theme";
      } else {
        themeLabel.innerText = "Light Theme";
      }
      console.log("Theme toggled. Current classes on body:", document.body.className);
    });
  } else {
    console.error("Toggle theme button not found.");
  }

  const avatars = document.querySelectorAll(".avatar");
  const selectedAvatarText = document.getElementById("selectedAvatar");
  const avatarDescription = document.createElement("p");
  avatarDescription.id = "avatarDescription";
  selectedAvatarText.insertAdjacentElement("afterend", avatarDescription);

  // Avatar personalities
  const avatarPersonalities = {
    "Wise Owl": {
      intro: "I am the Wise Owl! 🦉 I provide **calm, detailed, and structured explanations** to help you understand complex coding concepts.",
      style: "As a wise and knowledgeable tutor, please answer the following question in a thoughtful, well-structured manner."
    },
    "Playful Robot": {
      intro: "I am the Playful Robot! 🤖 I explain things in a **fun, exciting, and interactive** way to make learning more enjoyable!",
      style: "As a playful and energetic tutor, please answer the following question in a fun and engaging tone."
    },
    "Friendly Dragon": {
      intro: "I am the Friendly Dragon! 🐉 I offer **encouraging and creative** explanations so you feel confident while learning!",
      style: "As a friendly and supportive tutor, please answer the following question in an encouraging and creative way."
    }
  };

  let selectedAvatar = null;

  avatars.forEach(avatar => {
    avatar.addEventListener("click", function () {
      selectedAvatar = avatar.dataset.name;
      selectedAvatarText.innerText = `Selected Avatar: ${selectedAvatar}`;

      // Show avatar personality description
      if (avatarPersonalities[selectedAvatar]) {
        avatarDescription.innerHTML = `<strong>${avatarPersonalities[selectedAvatar].intro}</strong>`;
      }

      console.log("Avatar selected:", selectedAvatar);
    });
  });

  // ----------------------------
  // 2. Utility: Refresh Animation
  // ----------------------------
  function refreshAnimation(element) {
    element.style.animation = 'none';
    element.offsetHeight; // Trigger reflow to reset animation
    element.style.animation = '';
  }

  // ----------------------------
  // 3. Guided Lessons Functionality
  // ----------------------------
  const lessons = [
    {
      title: "Lesson 1: What is Python?",
      content: "Python is a popular programming language that's easy to learn. It's used for web development, data analysis, AI, and more!"
    },
    {
      title: "Lesson 2: Printing in Python",
      content: "In Python, you can display text using the print() function. For example: <code>print('Hello, World!')</code>"
    },
    {
      title: "Lesson 3: Variables in Python",
      content: "Variables store information. For example: <code>name = 'Python Pal'</code> creates a variable called name."
    },
    {
      title: "Lesson 4: Basic Math",
      content: "You can perform arithmetic in Python. For example, try <code>print(2 + 3)</code> to see the result."
    }
  ];

  const lessonContent = document.getElementById("lesson-content");
  const prevLessonButton = document.getElementById("prevLesson");
  const nextLessonButton = document.getElementById("nextLesson");

  if (!lessonContent) {
    console.error("Error: Element with ID 'lesson-content' not found in the HTML.");
  } else {
    console.log("Found 'lesson-content' element.");
  }

  let currentLessonIndex = parseInt(localStorage.getItem("currentLessonIndex"), 10);
  if (isNaN(currentLessonIndex) || currentLessonIndex < 0 || currentLessonIndex >= lessons.length) {
    currentLessonIndex = 0;
  }
  console.log("Initial lesson index:", currentLessonIndex);

  function loadLesson(index) {
    if (index >= 0 && index < lessons.length) {
      const lesson = lessons[index];
      lessonContent.innerHTML = `<h3>${lesson.title}</h3><p>${lesson.content}</p>`;
      localStorage.setItem("currentLessonIndex", index);
      prevLessonButton.disabled = index === 0;
      nextLessonButton.disabled = index === lessons.length - 1;
      console.log(`Loaded lesson ${index}: ${lesson.title}`);
      awardBadge("Lesson " + (index + 1) + " Completed");
    } else {
      console.error("Attempted to load an invalid lesson index:", index);
    }
  }

  loadLesson(currentLessonIndex);

  prevLessonButton.addEventListener("click", function () {
    if (currentLessonIndex > 0) {
      currentLessonIndex--;
      loadLesson(currentLessonIndex);
      refreshAnimation(lessonContent);
      console.log("Moved to previous lesson:", currentLessonIndex);
    }
  });

  nextLessonButton.addEventListener("click", function () {
    if (currentLessonIndex < lessons.length - 1) {
      currentLessonIndex++;
      loadLesson(currentLessonIndex);
      refreshAnimation(lessonContent);
      console.log("Moved to next lesson:", currentLessonIndex);
    }
  });

  // ----------------------------
  // 4. Chat Functionality with Avatar-Specific Instructions
  // ----------------------------
  const apiKeyInput = document.getElementById("apiKeyInput");
  const sendButton = document.getElementById("sendButton");
  const userPrompt = document.getElementById("userPrompt");
  const responseArea = document.getElementById("responseArea");
 
  avatars.forEach(avatar => {
    avatar.addEventListener("click", function () {
      selectedAvatar = avatar.dataset.name;
      selectedAvatarText.innerText = "Selected Avatar: " + selectedAvatar;
      console.log("Avatar selected:", selectedAvatar);
    });
  });


  sendButton.addEventListener("click", function () {
    let promptText = userPrompt.value;
    const api_key = apiKeyInput.value.trim();

    if (!promptText) {
      alert("Please type a question for Python Pal!");
      return;
    }

    // Modify prompt based on selected avatar's style
    if (selectedAvatar && avatarPersonalities[selectedAvatar]) {
      promptText = `${avatarPersonalities[selectedAvatar].style} ${promptText}`;
      console.log("Modified prompt with avatar personality:", promptText);
    }

    responseArea.innerHTML = "Python Pal is thinking...";
    
    fetch("/api/tutor", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: promptText, api_key: api_key })
    })
      .then(response => response.json())
      .then(data => {
        if (data.error) {
          responseArea.innerHTML = "Error: " + data.error;
        } else {
          const avatarPrefix = selectedAvatar ? `<strong>${selectedAvatar} says:</strong> ` : "";
          responseArea.innerHTML = avatarPrefix + data.answer;
        }
      })
      .catch(error => {
        responseArea.innerHTML = "Error: " + error;
      });
  });

  // ----------------------------
  // 5. Mini Challenge Functionality
  // ----------------------------
  const submitChallenge = document.getElementById("submitChallenge");
  const challengeAnswer = document.getElementById("challengeAnswer");
  const challengeFeedback = document.getElementById("challengeFeedback");

  submitChallenge.addEventListener("click", function () {
    const answer = challengeAnswer.value;
    if (answer.includes('print') && answer.includes("Hello, World")) {
      challengeFeedback.innerHTML = "Great job! You solved the challenge!";
      awardBadge("Challenge Master");
    } else {
      challengeFeedback.innerHTML = "Not quite right. Hint: Use the print() function to display 'Hello, World!'.";
    }
    refreshAnimation(challengeFeedback);
  });

  // ----------------------------
  // 6. Fun Facts Functionality
  // ----------------------------
  const funFacts = [
    "Python was named after the comedy series 'Monty Python’s Flying Circus'!",
    "Python is one of the most popular programming languages in the world.",
    "Python uses indentation to define code blocks.",
    "The language is known for its simplicity and readability.",
    "Python supports multiple programming paradigms including procedural, object-oriented, and functional programming."
  ];
  const factText = document.getElementById("factText");
  const newFactButton = document.getElementById("newFactButton");
  if (newFactButton && factText) {
    newFactButton.addEventListener("click", function () {
      const randomFact = funFacts[Math.floor(Math.random() * funFacts.length)];
      factText.innerText = randomFact;
      console.log("New fact selected:", randomFact);
    });
  } else {
    console.error("Fun facts elements not found (factText or newFactButton).");
  }

  // ----------------------------
  // 7. Achievement Badges Functionality
  // ----------------------------
  function awardBadge(badgeName) {
    const badgeList = document.getElementById("badgeList");
    if (!badgeList) return;
    const existingBadges = Array.from(badgeList.children).map(li => li.innerText);
    if (!existingBadges.includes(badgeName)) {
      const badge = document.createElement("li");
      badge.innerText = badgeName;
      badgeList.appendChild(badge);
      badge.style.animation = 'popIn 0.5s ease-out';
      console.log("Awarded badge:", badgeName);
    }
  }
  
  const quizData = [
    { question: "What function is used to display text in Python?", answer: "print" },
    { question: "Which keyword is used to define a function in Python?", answer: "def" },
    { question: "What symbol is used for single-line comments in Python?", answer: "#" },
    { question: "How do you create a variable in Python?", answer: "by assigning a value to a name" }
  ];

  const quizQuestion = document.getElementById("quiz-question");
  const quizAnswer = document.getElementById("quiz-answer");
  const submitQuiz = document.getElementById("submitQuiz");
  const quizFeedback = document.getElementById("quiz-feedback");

  let currentQuizIndex = 0;

  function loadQuiz() {
    quizQuestion.innerText = quizData[currentQuizIndex].question;
  }

  submitQuiz.addEventListener("click", function () {
    if (quizAnswer.value.toLowerCase().trim() === quizData[currentQuizIndex].answer.toLowerCase()) {
      quizFeedback.innerHTML = "✅ Correct! Well done!";
      awardBadge("Python Quiz Master 🎓");
      startConfetti(); // 🎉 Celebrate correct answer
      setTimeout(() => {
        quizFeedback.innerHTML = "";
        nextQuiz();
      }, 2000);
    } else {
      quizFeedback.innerHTML = "❌ Try again!";
    }
  });

  function nextQuiz() {
    currentQuizIndex = (currentQuizIndex + 1) % quizData.length;
    loadQuiz();
  }

  loadQuiz(); // Load first quiz

  // ----------------------------
  // ✨ AI Typing Effect (New Feature)
  // ----------------------------
  function typeResponse(text, element) {
    element.innerHTML = ""; // Clear old text
    let index = 0;

    function typeLetter() {
      if (index < text.length) {
        element.innerHTML += text.charAt(index);
        index++;
        setTimeout(typeLetter, 30); // Adjust speed of typing effect
      }
    }

    typeLetter();
  }

  // Modify AI response function to include typing effect
  sendButton.addEventListener("click", function () {
    let promptText = userPrompt.value;
    const api_key = apiKeyInput.value.trim();

    if (!promptText) {
      alert("Please type a question for Python Pal!");
      return;
    }

    responseArea.innerHTML = "Python Pal is thinking...";
  })

  function speakText(text) {
    const speech = new SpeechSynthesisUtterance();
    speech.text = text;
    speech.lang = "en-US";
    speech.rate = 1;
    speech.pitch = 1.2; // Adjust for playful tone
    window.speechSynthesis.speak(speech);
  }

  // ----------------------------
  // 🎉 Confetti Celebration (New Feature)
  // ----------------------------
  const confettiCanvas = document.getElementById("confetti-canvas");
  const confettiCtx = confettiCanvas.getContext("2d");

  function startConfetti() {
    let particles = [];
    for (let i = 0; i < 100; i++) {
      particles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        r: Math.random() * 10 + 2,
        d: Math.random() * 10,
        color: `hsl(${Math.random() * 360}, 100%, 50%)`
      });
    }

    function drawConfetti() {
      confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
      particles.forEach(p => {
        confettiCtx.beginPath();
        confettiCtx.arc(p.x, p.y, p.r, 0, Math.PI * 2, false);
        confettiCtx.fillStyle = p.color;
        confettiCtx.fill();
      });

      particles.forEach(p => {
        p.y += p.d;
        if (p.y > window.innerHeight) {
          p.y = 0;
          p.x = Math.random() * window.innerWidth;
        }
      });

      requestAnimationFrame(drawConfetti);
    }

    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
    drawConfetti();

    setTimeout(() => {
      confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    }, 3000);
  }

});
