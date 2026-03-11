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

## Project structure

```text
.
├── index.html
├── style.css
├── script.js
├── data/
│   └── questions.js
├── audio/
│   ├── q1.mp3
│   ├── q2.mp3
│   ├── q3.mp3
│   ├── q4.mp3
│   └── q5.mp3
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

## Audio notes

The game references `audio/q1.mp3` to `audio/q5.mp3`.

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
- More question banks (50/100+)
- Leaderboard and class ranking
- React + Firebase version with student login
