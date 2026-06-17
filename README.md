# Wordle

A browser-based Wordle clone built with vanilla HTML, CSS, and JavaScript. Players have six attempts to guess a hidden five-letter word, with tile and keyboard feedback after each submission.

![Wordle Screenshot](https://github.com/user-attachments/assets/f59dbbf4-8ee7-406d-9e77-b0d68deb3d90)

## Overview

This project recreates the core Wordle experience in a lightweight, dependency-free web application. It includes NYT-style word lists, answer validation, responsive layout, and a persistent dark mode.

Wordle was originally created by Josh Wardle and later acquired by [The New York Times](https://www.nytimes.com/games/wordle). This repository is an independent educational implementation and is not affiliated with or endorsed by The New York Times.

## Features

- **Standard Wordle rules** — Six guesses, five-letter words, color-coded feedback
- **Curated lexicon** — ~2,300 solution words and ~13,000 allowed guesses, with plural answers excluded
- **Physical and on-screen keyboard support** — Type directly or use the virtual keyboard
- **Tile flip animations and invalid-guess shake feedback**
- **Keyboard state tracking** — Key colors update and never downgrade within a game
- **Dark mode** — Toggle in the header; preference saved to `localStorage`
- **Responsive layout** — Usable on mobile, tablet, and desktop viewports
- **Accessibility considerations** — WCAG 2.1 AA contrast in light and dark modes, visible focus states, reduced-motion support, and screen-reader feedback for toasts

## Tech Stack

| Layer | Technologies |
| --- | --- |
| Markup | HTML5 |
| Styling | CSS3 (custom properties, Grid, Flexbox, media queries) |
| Logic | JavaScript (ES6+) |

No frameworks, build tools, or package managers are required to run the game.

## Getting Started

### Requirements

- A modern browser (Chrome, Firefox, Safari, or Edge)

### Run locally

**Option 1 — Open directly**

Open `index.html` in your browser.

**Option 2 — Local server (recommended)**

```bash
git clone https://github.com/KamKoro/project-1-Wordle.git
cd project-1-Wordle
npx serve -l 3000
```

Then visit `http://localhost:3000`.

## How to Play

1. Enter a five-letter word using your keyboard or the on-screen keys.
2. Press **Enter** to submit the guess.
3. Review the tile colors:
   - **Green** — correct letter, correct position
   - **Yellow** — correct letter, wrong position
   - **Gray** — letter not in the word
4. Repeat until you solve the word or use all six guesses.
5. Click **Play Again!** to start a new game with a different answer.

Each new game selects a random word from the solution list. Plural words are not used as answers.

## Project Structure

```
project-1-Wordle/
├── index.html           # Application shell and in-page instructions
├── css/
│   └── style.css        # Theme variables, layout, responsive styles
├── js/
│   ├── app.js           # Game state, input handling, UI updates
│   ├── data.js          # Word lists and lexicon utilities
│   └── partials.js      # Optional HTML partial loader
├── partials/
│   └── navbar.html      # Optional navbar partial (not currently wired in)
└── README.md
```

## Architecture Notes

### Word lists (`js/data.js`)

- `answerWords` — candidate solution words
- `allowedWords` — valid guess dictionary
- `ALLOWED_SET` — `Set` used for O(1) guess validation
- `SOLUTIONS` — normalized solution pool with plural filtering applied
- `pickRandomSolution()` — selects a random answer for each new game

### Game logic (`js/app.js`)

- Manages board rendering, guess evaluation, animations, and keyboard state
- Blocks input while tile animations are in progress
- Persists theme preference under the `theme` key in `localStorage`

## Roadmap

- [ ] Hard mode (revealed hints must be reused)
- [ ] Statistics and win streak tracking
- [ ] Shareable result grid
- [ ] Optional daily word mode
- [ ] Settings panel using navbar partials

## License

This project is provided for educational purposes.

## Acknowledgments

- [Josh Wardle](https://en.wikipedia.org/wiki/Josh_Wardle) — creator of Wordle
- [The New York Times](https://www.nytimes.com/games/wordle) — current publisher of Wordle
- Community-maintained Wordle word lists used as reference for the game dictionary
