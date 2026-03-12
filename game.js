const QUESTION_TIME = 15;
const HINT_PENALTY = 5;
const WRONG_PENALTY = 50;
const TOP_RANKING = 5;

const scoreEl = document.getElementById("score");
const timerEl = document.getElementById("timer");
const progressEl = document.getElementById("progress");
const optionsEl = document.getElementById("options-container");
const sentenceDisplay = document.getElementById("sentence-display");
const sentenceText = document.getElementById("sentence-text");
const playBtn = document.getElementById("play-btn");
const hintBtn = document.getElementById("hint-btn");
const micBtn = document.getElementById("mic-btn");
const transcriptEl = document.getElementById("transcript");
const feedbackPanel = document.getElementById("feedback-panel");
const feedbackTitle = document.getElementById("feedback-title");
const feedbackSuggestion = document.getElementById("feedback-suggestion");
const nextBtn = document.getElementById("next-btn");
const leaderboardEl = document.getElementById("leaderboard");
const livesEl = document.getElementById("lives");
const categoryTag = document.getElementById("category-tag");
const questionTag = document.getElementById("question-tag");
const auntieMood = document.getElementById("auntie-mood");
const auntieLine = document.getElementById("auntie-line");
const totalProgressFill = document.getElementById("total-progress-fill");

let currentMode = "all";
let modeData = [...gameData];
let currentIdx = Number(localStorage.getItem("ingquest_current_idx") || 0);
let score = Number(localStorage.getItem("ingquest_score") || 0);
let lives = Number(localStorage.getItem("ingquest_lives") || 3);
let timeLeft = QUESTION_TIME;
let timerInterval;
let answered = false;
let recognition;
let isRecording = false;

const navButtons = document.querySelectorAll(".nav-btn");

function persistState() {
  localStorage.setItem("ingquest_current_idx", String(currentIdx));
  localStorage.setItem("ingquest_score", String(score));
  localStorage.setItem("ingquest_lives", String(lives));
  localStorage.setItem("ingquest_mode", currentMode);
}

function loadModePreference() {
  const savedMode = localStorage.getItem("ingquest_mode");
  if (savedMode && ["all", "gerund", "infinitive", "connector"].includes(savedMode)) {
    currentMode = savedMode;
  }
}

function filterData(mode) {
  if (mode === "gerund") return gameData.filter((q) => q.category === "Gerund");
  if (mode === "infinitive") return gameData.filter((q) => q.category === "Infinitive");
  if (mode === "connector") return gameData.filter((q) => q.category === "Connector");
  return [...gameData];
}

function updateAuntie(mood, line) {
  const moods = {
    happy: "😄",
    thinking: "🤔",
    idea: "💡",
    warning: "😬",
    angry: "😤",
    neutral: "🧠",
  };
  auntieMood.textContent = moods[mood] || moods.neutral;
  auntieLine.textContent = line;
}

function updateLives() {
  livesEl.textContent = "❤️".repeat(Math.max(lives, 0)) || "💔";
}

function updateProgress() {
  const percent = modeData.length ? ((currentIdx + 1) / modeData.length) * 100 : 0;
  progressEl.style.width = `${Math.min(percent, 100)}%`;

  const overall = Number(localStorage.getItem("ingquest_overall_done") || 0);
  const allPercent = Math.min((overall / gameData.length) * 100, 100);
  totalProgressFill.style.width = `${allPercent}%`;
}

function updateScore() {
  scoreEl.textContent = score;
}

function currentQuestion() {
  return modeData[currentIdx];
}

function normalizeText(input) {
  return input.toLowerCase().replace(/[.,!?']/g, "").replace(/\s+/g, " ").trim();
}

function speakSentence(text) {
  if ("speechSynthesis" in window) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 0.95;
    speechSynthesis.speak(utterance);
    return true;
  }
  return false;
}

function playAudio() {
  const q = currentQuestion();
  if (!q) return;

  const audio = new Audio(q.audio);
  audio.play().catch(() => {
    const ok = speakSentence(q.sentence);
    if (ok) {
      updateAuntie("thinking", "No MP3 found, so I used browser voice. Keep listening!");
    } else {
      updateAuntie("warning", "Audio unavailable. Add your files in /audio.");
    }
  });
}

function setFeedback(title, suggestion, tone = "neutral") {
  feedbackTitle.textContent = title;
  feedbackSuggestion.textContent = suggestion;
  feedbackPanel.classList.remove("hidden");
  updateAuntie(tone, suggestion);
}

function hideFeedback() {
  feedbackPanel.classList.add("hidden");
}

function renderQuestion() {
  const q = currentQuestion();
  if (!q) {
    endGame();
    return;
  }

  answered = false;
  hideFeedback();
  sentenceDisplay.classList.add("hidden");
  sentenceDisplay.textContent = q.sentence;
  sentenceText.classList.add("blur");
  sentenceText.textContent = q.sentence;
  optionsEl.innerHTML = "";
  categoryTag.textContent = q.category.toUpperCase();
  questionTag.textContent = `Question ${currentIdx + 1} / ${modeData.length}`;

  q.options.forEach((opt) => {
    const btn = document.createElement("button");
    btn.className = "option-btn";
    btn.textContent = opt;
    btn.addEventListener("click", () => checkAnswer(opt));
    optionsEl.appendChild(btn);
  });

  timeLeft = QUESTION_TIME;
  timerEl.textContent = timeLeft;
  updateProgress();
  startTimer();
  persistState();
}

function disableOptions() {
  optionsEl.querySelectorAll("button").forEach((button) => {
    button.disabled = true;
  });
}

function checkAnswer(selected) {
  if (answered) return;
  answered = true;
  clearInterval(timerInterval);

  const q = currentQuestion();
  disableOptions();

  if (selected === q.answer) {
    score += timeLeft * 10;
    updateScore();
    incrementOverallProgress();
    setFeedback("Correct! 🌟", `Auntie's tip: ${q.hint}`, "happy");
  } else {
    score -= WRONG_PENALTY;
    lives -= 1;
    updateScore();
    updateLives();
    setFeedback(
      "Not this time!",
      `Correct answer: ${q.answer}. Auntie's tip: ${q.hint}`,
      lives <= 1 ? "angry" : "thinking"
    );
  }

  persistState();

  if (lives <= 0) {
    setFeedback("Game Over", "You used all lives. Save score and try again.", "warning");
    nextBtn.textContent = "Save score";
  } else {
    nextBtn.textContent = "Continue";
  }
}

function incrementOverallProgress() {
  const done = Number(localStorage.getItem("ingquest_overall_done") || 0);
  localStorage.setItem("ingquest_overall_done", String(Math.min(done + 1, gameData.length)));
}

function startTimer() {
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    timeLeft -= 1;
    timerEl.textContent = timeLeft;

    if (timeLeft <= 0) {
      checkAnswer(null);
    }
  }, 1000);
}

function showSentence() {
  sentenceDisplay.classList.remove("hidden");
  sentenceText.classList.remove("blur");
}

function useHint() {
  if (answered) return;
  score -= HINT_PENALTY;
  updateScore();
  showSentence();
  setFeedback("Hint used (-5)", currentQuestion().hint, "idea");
  persistState();
}

function goNext() {
  if (lives <= 0) {
    endGame();
    return;
  }

  if (!answered) {
    setFeedback("Answer first", "Choose an option before continuing.", "thinking");
    return;
  }

  currentIdx += 1;
  if (currentIdx >= modeData.length) {
    endGame();
    return;
  }

  renderQuestion();
}

function switchGame(mode) {
  currentMode = mode;
  modeData = filterData(mode);
  currentIdx = 0;
  lives = 3;
  score = 0;
  updateLives();
  updateScore();
  navButtons.forEach((btn) => btn.classList.toggle("active", btn.dataset.mode === mode));
  persistState();
  renderQuestion();
}

function displayRanking() {
  const ranking = JSON.parse(localStorage.getItem("ingquest_ranking") || "[]");
  leaderboardEl.innerHTML = ranking
    .map((item) => `<li><span>${item.name}</span><b>${item.score} pts</b></li>`)
    .join("");
}

function saveScore() {
  const name = prompt("Game over! Enter your name for ranking:") || "Anonymous";
  const ranking = JSON.parse(localStorage.getItem("ingquest_ranking") || "[]");
  ranking.push({ name: name.trim().slice(0, 20), score });
  ranking.sort((a, b) => b.score - a.score);
  localStorage.setItem("ingquest_ranking", JSON.stringify(ranking.slice(0, TOP_RANKING)));
  displayRanking();
}

function endGame() {
  clearInterval(timerInterval);
  saveScore();
  setFeedback("Round finished!", `Final score: ${score} points. Start a new mode to play again.`, "happy");
  optionsEl.innerHTML = "";
  questionTag.textContent = "Completed";
  currentIdx = 0;
  lives = 3;
  score = 0;
  updateLives();
  updateScore();
  persistState();
}

function setupVoiceRecognition() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    micBtn.disabled = true;
    transcriptEl.textContent = "Speech recognition unsupported in this browser.";
    return;
  }

  recognition = new SpeechRecognition();
  recognition.lang = "en-US";
  recognition.continuous = false;
  recognition.interimResults = false;

  recognition.onresult = (event) => {
    const spoken = event.results[0][0].transcript;
    const original = currentQuestion().sentence;
    transcriptEl.textContent = `You said: "${spoken}"`;

    if (normalizeText(spoken) === normalizeText(original)) {
      score += 100;
      updateScore();
      setFeedback("Pronunciation bonus +100", "Perfect repeat! Auntie is proud of you.", "happy");
    } else {
      setFeedback(
        "Good try!",
        `Try again. Expected close to: "${original}"`,
        "thinking"
      );
    }

    micBtn.classList.remove("mic-active");
    micBtn.textContent = "🎤 Start recording";
    isRecording = false;
    persistState();
  };

  recognition.onerror = () => {
    micBtn.classList.remove("mic-active");
    micBtn.textContent = "🎤 Start recording";
    isRecording = false;
    setFeedback("Mic error", "Could not capture voice. Check microphone permissions.", "warning");
  };
}

function toggleRecording() {
  if (!recognition) return;

  if (!isRecording) {
    recognition.start();
    micBtn.classList.add("mic-active");
    micBtn.textContent = "🛑 Stop recording";
    transcriptEl.textContent = "Listening...";
  } else {
    recognition.stop();
    micBtn.classList.remove("mic-active");
    micBtn.textContent = "🎤 Start recording";
  }

  isRecording = !isRecording;
}

function bootstrap() {
  loadModePreference();
  modeData = filterData(currentMode);

  if (currentIdx >= modeData.length) {
    currentIdx = 0;
  }

  updateLives();
  updateScore();
  navButtons.forEach((btn) => btn.classList.toggle("active", btn.dataset.mode === currentMode));
  displayRanking();
  setupVoiceRecognition();
  updateAuntie("neutral", "Listen first, then answer like a pro.");

  renderQuestion();
}

playBtn.addEventListener("click", playAudio);
document.getElementById("toggle-text").addEventListener("click", showSentence);
hintBtn.addEventListener("click", useHint);
nextBtn.addEventListener("click", goNext);
micBtn.addEventListener("click", toggleRecording);
navButtons.forEach((btn) => btn.addEventListener("click", () => switchGame(btn.dataset.mode)));

bootstrap();
