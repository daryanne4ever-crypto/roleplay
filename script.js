let currentQuestion = 0;
let score = 0;
let answered = false;

const playBtn = document.getElementById("playBtn");
const revealBtn = document.getElementById("revealBtn");
const choices = document.querySelectorAll(".choice");
const sentence = document.getElementById("sentence");
const feedback = document.getElementById("feedback");
const scoreDisplay = document.getElementById("score");
const nextBtn = document.getElementById("next");
const restartBtn = document.getElementById("restart");
const questionCounter = document.getElementById("questionCounter");

function currentItem() {
  return questions[currentQuestion];
}

function renderQuestion() {
  const item = currentItem();
  questionCounter.textContent = `Question ${currentQuestion + 1} / ${questions.length}`;
  sentence.textContent = item.sentence;
  sentence.classList.add("hidden");
  feedback.textContent = "";
  feedback.className = "feedback";
  nextBtn.disabled = true;
  answered = false;

  choices.forEach((button) => {
    button.disabled = false;
    button.classList.remove("correct", "wrong");
  });
}

function playAudio() {
  const item = currentItem();
  const audio = new Audio(item.audio);

  audio.play().catch(() => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(item.sentence);
      utterance.lang = "en-US";
      speechSynthesis.speak(utterance);
      feedback.textContent = "Audio file not found. Playing browser voice instead.";
      feedback.className = "feedback info";
    } else {
      feedback.textContent = "Audio unavailable. Please add local MP3 files in /audio.";
      feedback.className = "feedback info";
    }
  });
}

function checkAnswer(button) {
  if (answered) return;

  const selected = button.textContent;
  const answer = currentItem().answer;

  answered = true;

  choices.forEach((choice) => {
    choice.disabled = true;
    if (choice.textContent === answer) {
      choice.classList.add("correct");
    }
  });

  if (selected === answer) {
    score += 1;
    button.classList.add("correct");
    feedback.textContent = "✅ Correct!";
    feedback.className = "feedback correct";
  } else {
    button.classList.add("wrong");
    feedback.textContent = `❌ Wrong. Correct answer: ${answer}`;
    feedback.className = "feedback wrong";
  }

  scoreDisplay.textContent = `Score: ${score}`;
  nextBtn.disabled = false;
}

function finishGame() {
  questionCounter.textContent = `Completed ${questions.length} / ${questions.length}`;
  feedback.textContent = `🎉 Game finished! Final score: ${score}/${questions.length}`;
  feedback.className = "feedback info";
  nextBtn.disabled = true;
  restartBtn.classList.remove("hidden");
}

playBtn.addEventListener("click", playAudio);

revealBtn.addEventListener("click", () => {
  sentence.classList.toggle("hidden");
});

choices.forEach((button) => {
  button.addEventListener("click", () => checkAnswer(button));
});

nextBtn.addEventListener("click", () => {
  currentQuestion += 1;

  if (currentQuestion >= questions.length) {
    finishGame();
    return;
  }

  renderQuestion();
});

restartBtn.addEventListener("click", () => {
  currentQuestion = 0;
  score = 0;
  scoreDisplay.textContent = "Score: 0";
  restartBtn.classList.add("hidden");
  renderQuestion();
});

renderQuestion();
