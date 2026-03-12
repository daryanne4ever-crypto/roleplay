# 💜 English Quest: Auntie Challenge

Projeto educacional gamificado para prática de inglês com foco em listening, gerund vs infinitive e conectores.

## Principais ajustes pedagógicos desta versão

- **Sem sistema de vidas** (sem game over por erro)
- **Timer de 120 segundos** por frase
- **Refazer obrigatório**: o aluno só avança quando acerta
- **Feedback visual da Auntie** por estado (`thinking`, `idea`, `happy`)

## Funcionalidades

- Modos: All Challenges, Gerund, Infinitive, Connectors
- 80 frases no banco (`data/phrases.js`)
- Botão de áudio com fallback para Web Speech Synthesis
- Botão de dica com penalidade leve (`-5`)
- Reconhecimento de voz (quando suportado pelo navegador)
- Progresso salvo no `localStorage` (`userProgress`)
- Ranking local da turma (Top 5)

## Estrutura

```text
.
├── index.html
├── style.css
├── game.js
├── data/
│   └── phrases.js
├── images/
│   ├── auntie-thinking.svg
│   ├── auntie-idea.svg
│   └── auntie-happy.svg
└── audio/
```

## Executar

```bash
python3 -m http.server 8000
```

Abra `http://localhost:8000/index.html`.
