# 💜 ING & Connect: The Ultimate Classroom Challenge

Professional browser game for English classrooms with listening, grammar, voice interaction, scoring, timer, and ranking.

## What this project teaches

- Gerund vs Infinitive decision making
- Connectors (`and`, `but`, `because`)
- Listening-first workflow (audio before visible text)
- Pronunciation practice with Web Speech API

## Professional features

- **80-question bank** with scaffolded difficulty (`1` to `5`)
- **Modes**: All Challenges, Gerund, Infinitive, Connectors
- **Timer + scoring bonus** (`timeLeft * 10`)
- **Hint penalty** (`-5 points`)
- **Wrong answer penalty** (`-50 points`) + lives system
- **Voice recognition** for sentence repetition bonus
- **LocalStorage persistence** for progress, score, mode, ranking
- **Class leaderboard** (Top 5)
- **Auntie feedback box** with dynamic mood states

## Project structure

```text
.
├── index.html
├── style.css
├── game.js
├── data/
│   └── phrases.js
├── audio/
│   └── (q1..q80/c51..c80 mp3 files - optional)
└── images/
```

## Run locally

```bash
python3 -m http.server 8000
```

Open <http://localhost:8000>.

## Audio behavior

Each question references an MP3 path in `audio/`.
If a file is missing, the game falls back to browser text-to-speech (when supported).

## Voice recognition notes

The mic button uses `SpeechRecognition` / `webkitSpeechRecognition`.
If unsupported, the UI gracefully disables voice capture.

## Portfolio value

This project demonstrates:

- Applied educational design
- UI/UX with a complete game loop
- Data modeling for scalable content packs
- Browser APIs integration (Speech + Storage)
