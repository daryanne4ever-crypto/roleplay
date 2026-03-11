const rounds = [
  {
    sentence: 'Reading books is important for learning English.',
    answer: 'gerund',
    hint: 'Identify the -ing form acting like a noun.'
  },
  {
    sentence: 'She is studying English because she wants to travel.',
    answer: 'continuous',
    hint: 'Focus on the tense formed with be + verb-ing.'
  },
  {
    sentence: 'The movie was boring but the actors were great.',
    answer: 'adjective',
    hint: 'Here -ing describes a noun.'
  },
  {
    sentence: 'They enjoy watching movies and listening to music.',
    answer: 'gerund',
    hint: 'Both -ing words act as things they enjoy.'
  },
  {
    sentence: 'He decided to study English because he wants a better job.',
    answer: 'infinitive',
    hint: 'Look for to + base verb.'
  }
];

let current = 0;
let score = 0;

const roundEl = document.getElementById('round');
const totalEl = document.getElementById('total');
const promptEl = document.getElementById('prompt');
const resultEl = document.getElementById('result');
const scoreEl = document.getElementById('score');
const playBtn = document.getElementById('playBtn');
const restartBtn = document.getElementById('restartBtn');
const choiceButtons = [...document.querySelectorAll('[data-choice]')];

totalEl.textContent = rounds.length;

const speak = (text) => {
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    speechSynthesis.cancel();
    speechSynthesis.speak(utterance);
  } else {
    resultEl.textContent = 'Speech synthesis is not supported in this browser.';
  }
};

const setRoundUI = () => {
  roundEl.textContent = current + 1;
  promptEl.textContent = rounds[current].hint;
};

const finishGame = () => {
  promptEl.textContent = 'Game finished!';
  resultEl.textContent = `Final score: ${score}/${rounds.length}`;
  playBtn.disabled = true;
  choiceButtons.forEach((button) => {
    button.disabled = true;
  });
  restartBtn.hidden = false;
};

const checkAnswer = (choice) => {
  if (choice === rounds[current].answer) {
    score += 1;
    scoreEl.textContent = score;
    resultEl.textContent = '✅ Correct!';
  } else {
    resultEl.textContent = `❌ Try again! Correct answer: ${rounds[current].answer}.`;
  }

  current += 1;

  if (current >= rounds.length) {
    finishGame();
    return;
  }

  setRoundUI();
};

const resetGame = () => {
  current = 0;
  score = 0;
  scoreEl.textContent = '0';
  playBtn.disabled = false;
  choiceButtons.forEach((button) => {
    button.disabled = false;
  });
  restartBtn.hidden = true;
  resultEl.textContent = '';
  setRoundUI();
};

playBtn.addEventListener('click', () => {
  speak(rounds[current].sentence);
});

choiceButtons.forEach((button) => {
  button.addEventListener('click', () => {
    checkAnswer(button.dataset.choice);
  });
});

restartBtn.addEventListener('click', resetGame);

setRoundUI();
