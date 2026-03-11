# ING Quest – Listening & Grammar Game

A browser-based educational game for English classes.

## Learning goals

This game trains students to identify:

- Gerund (`-ing` as noun)
- Infinitive (`to + verb`)
- Continuous verb forms
- Adjectives ending in `-ing`
- Connectors: `and`, `but`, `because`
- Listening comprehension

## Question bank

- 25 prompts in `data/questions.js`
- Questions 1–5: mixed grammar targets (gerund, infinitive, continuous, adjective `-ing`)
- Questions 6–25: gerund-focused listening practice with real-life classroom contexts

## Project structure

```text
.
├── index.html
├── style.css
├── script.js
├── data/
│   └── questions.js
├── audio/
│   ├── q1.mp3 ... q25.mp3
└── images/
```

## How to run

1. Clone this repository.
2. Open `index.html` directly in your browser.
3. (Recommended) Serve with a simple local server for best audio behavior:

```bash
python3 -m http.server 8000
```

Then open <http://localhost:8000>.

## Gameplay

1. Click **Play Audio**.
2. Select the correct grammar function.
3. If needed, click **Show Sentence** to reveal the written sentence.
4. Click **Next** to continue.

## Audio notes

The game references `audio/q1.mp3` to `audio/q25.mp3`.

- Add your own recordings in the `audio/` folder.
- If files are missing, the game automatically falls back to browser text-to-speech when available.

## Classroom mode idea

- Divide students into groups.
- Play each sentence once or twice.
- Groups discuss and choose a grammar function.
- Award points for correct answers.

## Future improvements

- Timer and streak system
- Level progression
- Extra packs mixing gerund + infinitive in the same round
- Leaderboard and class ranking
- React + Firebase version with student login
