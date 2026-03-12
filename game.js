const QUESTION_TIME = 120;
const HINT_PENALTY = 5;
const TOP_RANKING = 5;

const scoreEl = document.getElementById("score");
const timerEl = document.getElementById("timer");
const progressEl = document.getElementById("progress");
const totalProgressFill = document.getElementById("total-progress-fill");
const optionsEl = document.getElementById("options-container");
const sentenceDisplay = document.getElementById("sentence-display");
const displayText = document.getElementById("display-text");
const categoryTag = document.getElementById("category-tag");
const questionTag = document.getElementById("question-tag");
const playBtn = document.getElementById("play-audio");
const hintBtn = document.getElementById("hint-btn");
const micBtn = document.getElementById("mic-btn");
const transcriptEl = document.getElementById("transcript");
const feedbackPanel = document.getElementById("feedback-panel");
const feedbackTitle = document.getElementById("feedback-title");
const feedbackSuggestion = document.getElementById("feedback-suggestion");
const nextBtn = document.getElementById("next-btn");
const leaderboardEl = document.getElementById("leaderboard");
const auntieAvatar = document.getElementById("auntie-avatar");
const navButtons = document.querySelectorAll(".nav-btn");

let currentMode = localStorage.getItem("ingquest_mode") || "all";
let modeData = [];
let currentIdx = Number(localStorage.getItem("userProgress") || 0);
let score = Number(localStorage.getItem("ingquest_score") || 0);
let timeLeft = QUESTION_TIME;
let timerInterval;
let recognition;
let isRecording = false;
let canAdvance = false;

function getModeData(mode) {
  if (mode === "gerund") return gameData.filter((q) => q.category === "Gerund");
  if (mode === "infinitive") return gameData.filter((q) => q.category === "Infinitive");
  if (mode === "connector") return gameData.filter((q) => q.category === "Connector");
  return [...gameData];
}

function updateAuntie(mood = "thinking") {
  auntieAvatar.src = `images/auntie-${mood}.svg`;
}

function setFeedback(title, message) {
  feedbackTitle.textContent = title;
  feedbackSuggestion.textContent = message;
  feedbackPanel.classList.remove("hidden");
}

function hideFeedback() {
  feedbackPanel.classList.add("hidden");
}

function persistState() {
  localStorage.setItem("ingquest_score", String(score));
  localStorage.setItem("ingquest_mode", currentMode);
  localStorage.setItem("userProgress", String(currentIdx));
}

function currentQuestion() {
  return modeData[currentIdx];
}

function updateScore() {
  scoreEl.textContent = score;
}

function updateProgress() {
  const modePercent = modeData.length ? ((currentIdx + 1) / modeData.length) * 100 : 0;
  progressEl.style.width = `${Math.min(modePercent, 100)}%`;

  const overall = Number(localStorage.getItem("ingquest_overall_done") || 0);
  totalProgressFill.style.width = `${Math.min((overall / gameData.length) * 100, 100)}%`;
}

function startTimer() {
  clearInterval(timerInterval);
  timeLeft = QUESTION_TIME;
  timerEl.textContent = timeLeft;

  timerInterval = setInterval(() => {
    timeLeft -= 1;
    timerEl.textContent = timeLeft;

    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      updateAuntie("thinking");
      setFeedback("Tempo encerrado", "O tempo acabou! Ouça o áudio novamente e tente de novo.");
      displayText.classList.remove("blur");
    }
  }, 1000);
}

function speakSentence(text) {
  if (!("speechSynthesis" in window)) return false;
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-US";
  utterance.rate = 0.95;
  speechSynthesis.speak(utterance);
  return true;
}

function playAudio() {
  const q = currentQuestion();
  if (!q) return;
  const audio = new Audio(q.audio);
  audio.play().catch(() => {
    if (!speakSentence(q.sentence)) {
      setFeedback("Audio indisponível", "Adicione os arquivos MP3 na pasta /audio.");
    }
  });
}

function showSentence() {
  sentenceDisplay.classList.remove("hidden");
  displayText.classList.remove("blur");
}

function useHint() {
  score -= HINT_PENALTY;
  updateScore();
  showSentence();
  updateAuntie("thinking");
  setFeedback("Dica aplicada (-5)", currentQuestion().hint);
  persistState();
}

function incrementOverallDone() {
  const done = Number(localStorage.getItem("ingquest_overall_done") || 0);
  localStorage.setItem("ingquest_overall_done", String(Math.min(done + 1, gameData.length)));
}

function checkAnswer(selected) {
  const q = currentQuestion();

  if (selected === q.answer) {
    clearInterval(timerInterval);
    score += 100;
    updateScore();
    incrementOverallDone();
    updateAuntie("idea");
    setFeedback("Excelente!", "Você acertou. Continue para a próxima frase.");
    canAdvance = true;
    persistState();
    return;
  }

  // Erro: não avança, aluno refaz a questão
  updateAuntie("thinking");
  showSentence();
  setFeedback("Ops!", "Essa não é a resposta correta. Tente novamente, você consegue!");
}

function renderQuestion() {
  const q = currentQuestion();
  if (!q) {
    endGame();
    return;
  }

  canAdvance = false;
  hideFeedback();
  sentenceDisplay.classList.add("hidden");
  sentenceDisplay.textContent = q.sentence;
  displayText.classList.add("blur");
  displayText.textContent = q.sentence;
  categoryTag.textContent = q.category.toUpperCase();
  questionTag.textContent = `Question ${currentIdx + 1} / ${modeData.length}`;

  optionsEl.innerHTML = "";
  q.options.forEach((option) => {
    const btn = document.createElement("button");
    btn.className = "option-btn";
    btn.textContent = option;
    btn.onclick = () => checkAnswer(option);
    optionsEl.appendChild(btn);
  });

  updateProgress();
  startTimer();
  persistState();
}

function nextQuestion() {
  if (!canAdvance) {
    setFeedback("Ainda não", "Para avançar, você precisa acertar a questão atual.");
    return;
  }

  currentIdx += 1;
  if (currentIdx < modeData.length) {
    renderQuestion();
  } else {
    endGame();
  }
}

function saveScore() {
  const name = prompt("Fim da trilha! Digite seu nome para o ranking:") || "Anonymous";
  const ranking = JSON.parse(localStorage.getItem("ingquest_ranking") || "[]");
  ranking.push({ name: name.trim().slice(0, 20), score });
  ranking.sort((a, b) => b.score - a.score);
  localStorage.setItem("ingquest_ranking", JSON.stringify(ranking.slice(0, TOP_RANKING)));
}

function displayRanking() {
  const ranking = JSON.parse(localStorage.getItem("ingquest_ranking") || "[]");
  leaderboardEl.innerHTML = ranking
    .map((item) => `<li><span>${item.name}</span><b>${item.score} pts</b></li>`)
    .join("");
}

function endGame() {
  clearInterval(timerInterval);
  saveScore();
  displayRanking();
  updateAuntie("happy");
  setFeedback("Incrível!", "Você completou toda a trilha da Auntie.");
  currentIdx = 0;
  localStorage.removeItem("userProgress");
  persistState();
}

function switchMode(mode) {
  currentMode = mode;
  modeData = getModeData(mode);
  currentIdx = 0;
  navButtons.forEach((btn) => btn.classList.toggle("active", btn.dataset.mode === mode));
  renderQuestion();
}

function normalizeText(input) {
  return input.toLowerCase().replace(/[.,!?']/g, "").replace(/\s+/g, " ").trim();
}

function setupVoiceRecognition() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    micBtn.disabled = true;
    transcriptEl.textContent = "Speech recognition indisponível neste navegador.";
    return;
  }

  recognition = new SpeechRecognition();
  recognition.lang = "en-US";
  recognition.continuous = false;
  recognition.interimResults = false;

  recognition.onresult = (event) => {
    const spoken = event.results[0][0].transcript;
    transcriptEl.textContent = `Você disse: "${spoken}"`;

    if (normalizeText(spoken) === normalizeText(currentQuestion().sentence)) {
      score += 50;
      updateScore();
      updateAuntie("happy");
      setFeedback("Pronúncia excelente", "Bônus +50 por repetir a frase com precisão!");
      persistState();
    } else {
      updateAuntie("thinking");
      setFeedback("Boa tentativa", "Tente pronunciar novamente para ganhar bônus.");
    }

    micBtn.classList.remove("mic-active");
    micBtn.textContent = "🎤 Gravar Pronúncia";
    isRecording = false;
  };

  recognition.onerror = () => {
    micBtn.classList.remove("mic-active");
    micBtn.textContent = "🎤 Gravar Pronúncia";
    isRecording = false;
  };
}

function toggleRecording() {
  if (!recognition) return;

  if (!isRecording) {
    recognition.start();
    micBtn.classList.add("mic-active");
    micBtn.textContent = "🛑 Parar gravação";
    transcriptEl.textContent = "Ouvindo...";
  } else {
    recognition.stop();
    micBtn.classList.remove("mic-active");
    micBtn.textContent = "🎤 Gravar Pronúncia";
  }

  isRecording = !isRecording;
}

function init() {
  modeData = getModeData(currentMode);
  if (currentIdx >= modeData.length) currentIdx = 0;

  updateAuntie("thinking");
  updateScore();
  displayRanking();
  setupVoiceRecognition();
  navButtons.forEach((btn) => btn.classList.toggle("active", btn.dataset.mode === currentMode));
  renderQuestion();
}

document.getElementById("toggle-text").addEventListener("click", showSentence);
playBtn.addEventListener("click", playAudio);
hintBtn.addEventListener("click", useHint);
nextBtn.addEventListener("click", nextQuestion);
micBtn.addEventListener("click", toggleRecording);
navButtons.forEach((btn) => btn.addEventListener("click", () => switchMode(btn.dataset.mode)));

init();
