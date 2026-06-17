# Wordle

A web-based implementation of the popular word puzzle game Wordle. Guess the hidden 5-letter word within six attempts using color-coded feedback.

![Wordle Screenshot](https://github.com/user-attachments/assets/f59dbbf4-8ee7-406d-9e77-b0d68deb3d90)

## About

Wordle is a word puzzle game that challenges players to correctly guess a five-letter word within six attempts. Originally created by software engineer Josh Wardle before being acquired by the New York Times (the name of the game being a play on Josh's surname), Wordle gained immense popularity and spawned several spinoffs in multiple languages and formats.

This project is a faithful recreation of the classic Wordle game with a clean, modern interface that closely matches the New York Times version.

## Features

- 🎮 **Classic Wordle Gameplay** - Guess 5-letter words with 6 attempts
- 🎨 **Dark Mode Toggle** - Switch between light and dark themes
- ⌨️ **Dual Input Methods** - Use your physical keyboard or on-screen virtual keyboard
- 🎯 **Color-Coded Feedback** - Visual indicators for correct letters, misplaced letters, and incorrect letters
- 💾 **Persistent Preferences** - Theme selection saved in browser localStorage
- 📱 **Responsive Design** - Optimized for desktop, tablet, and mobile devices
- ✨ **Smooth Animations** - Polished tile flip animations and transitions

## Technologies Used

- **HTML5** - Semantic markup and structure
- **CSS3** - Modern styling with CSS variables, flexbox, and grid
- **JavaScript (ES6+)** - Game logic and interactivity

## How to Play

1. Start by typing a 5-letter word guess
2. Press Enter or click the Enter button to submit your guess
3. Tiles will change color to provide feedback:
   - 🟩 **Green** - Letter is in the word and in the correct position
   - 🟨 **Yellow** - Letter is in the word but in the wrong position
   - ⬜ **Gray** - Letter is not in the word
4. Use the feedback to refine your next guess
5. Try to guess the word within 6 attempts!

## Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge)
- A local web server (optional, for development)

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd project-1-Wordle
   ```

2. Open the project in your browser:
   - **Option 1**: Simply open `index.html` in your browser
   - **Option 2**: Use a local server:
     ```bash
     npx serve -l 3000
     ```
     Then navigate to `http://localhost:3000`

## Project Structure

```
project-1-Wordle/
├── index.html          # Main HTML file
├── css/
│   └── style.css       # Stylesheet with responsive design and dark mode
├── js/
│   ├── app.js          # Main game logic and interactivity
│   └── data.js         # Word list database
└── README.md           # Project documentation
```

## Features in Detail

### Dark Mode
Toggle between light and dark themes using the button in the top-right corner. Your preference is automatically saved and will persist across sessions.

### Responsive Design
The game adapts seamlessly to different screen sizes, from mobile phones to large desktop displays, ensuring an optimal experience on any device.

### Word Validation
Only valid 5-letter words from the game's dictionary are accepted as guesses, ensuring fair gameplay.

## Future Enhancements

- [ ] Hard mode difficulty option
- [ ] Expanded word list
- [ ] Statistics tracking
- [ ] Share results feature
- [ ] Daily challenge mode

## License

This project is a recreation of Wordle for educational purposes.

## Acknowledgments

- Original Wordle game created by Josh Wardle
- Wordle is now owned and operated by The New York Times

---

**Enjoy playing Wordle!** 🎉
