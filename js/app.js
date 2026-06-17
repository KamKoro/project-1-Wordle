window.addEventListener('DOMContentLoaded', () => {
  // === Constants === //
  const wordLength = 5;
  const maxAttempts = 6;

  // === Variables === //
  let currentRow = 0;
  let currentGuess = '';
  let answerWord = '';

  // === Cached Element References === //
  const board = document.getElementById('game-board');
  const keyboard = document.getElementById('keyboard');
  const playAgainContainer = document.getElementById('play-again-container');
  const playAgainButton = document.getElementById('play-again');
  const darkModeToggle = document.getElementById('dark-mode-toggle');

  // === Functions === //
  function initializeGame() {
    if (!window.allowedWords || allowedWords.length === 0) {
      window.allowedWords = [];
    }
    currentRow = 0;
    currentGuess = '';
    playAgainContainer.style.display = 'none';
    renderBoard();
    setupKeyboard();
    pickAnswerWord();
  }

  // Create the game board
  // Each row will contain the same number of tiles as the word length
  function renderBoard() {
    board.innerHTML = '';
    for (let row = 0; row < maxAttempts; row++) {
      const rowElement = document.createElement('div');
      rowElement.className = 'row';
      for (let col = 0; col < wordLength; col++) {
        const tile = document.createElement('div');
        tile.className = 'tile';
        rowElement.appendChild(tile);
      }
      board.appendChild(rowElement);
    }
  }

  // Check if a word is a plural (Wordle does not use plurals as answers)
  function isPluralAnswer(word) {
    const irregularPlurals = new Set(['GEESE', 'TEETH', 'KNEES', 'FEET']);

    if (irregularPlurals.has(word)) return true;
    if (word.endsWith('ES')) return true;

    if (word.endsWith('S') && !word.endsWith('SS')) {
      const nonPluralSuffixes = /(US|IS|OS|AS|NS)$/;
      return !nonPluralSuffixes.test(word);
    }

    return false;
  }

  // Get words that are allowed to be chosen as the answer
  function getAnswerPool() {
    const source = window.answerWords && answerWords.length > 0 ? answerWords : allowedWords;
    return source.filter(word => !isPluralAnswer(word));
  }

  // Choose a random word from the answer list (common words, like real Wordle)
  function pickAnswerWord() {
    const answers = getAnswerPool();
    const index = Math.floor(Math.random() * answers.length);
    answerWord = answers[index].toUpperCase();
    console.log('The answer word is:', answerWord);
  }

  // Set up the keyboard layout
  function setupKeyboard() {
    const layout = [
      ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
      ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
      ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', '⌫']
    ];

    // Clear the keyboard
    keyboard.innerHTML = layout
      .map(row => `
        <div class="row">
          ${row.map(key => `<button class="key" data-key="${key}">${key}</button>`).join('')}
        </div>
      `)
      .join('');
  }

  // Handle keyboard input
  function handleKeyInput(key) {
    key = key.toUpperCase();

    // Handle special keys
    if (key === 'BACKSPACE' || key === '⌫') {
      currentGuess = currentGuess.slice(0, -1);
    } else if (key === 'ENTER') {
      handleGuess();
      return;
    } else if (/^[A-Z]$/.test(key) && currentGuess.length < wordLength) {
      currentGuess += key;
    }

    // Update the current row with the current guess
    renderCurrentGuessRow();
  }

  // Update the current tiles in the current row
  function renderCurrentGuessRow() {
    const row = board.children[currentRow];
    for (let i = 0; i < wordLength; i++) {
      const tile = row.children[i];
      tile.textContent = currentGuess[i] || '';
    }
  }

  // Show a toast message
  function showToast(message, duration = 3000) {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toast-message');

    toastMessage.textContent = message;
    toast.classList.add('show');

    setTimeout(() => {
      toast.classList.remove('show');
    }, duration);
  }

  // Handle the guess when the user presses Enter
  function handleGuess() {
    const guess = currentGuess.toUpperCase();
    if (guess.length !== wordLength) {
      showToast(`Enter a ${wordLength}-letter word.`);
      return;
    }

    // Check if the guess is in the word list
    if (!allowedWords.includes(guess)) {
      showToast('Not in word list.');
      return;
    }

    // Check if the guess is correct
    const row = board.children[currentRow];
    const remainingAnswerLetters = answerWord.split('');
    const letterStates = Array(wordLength).fill('absent');

    for (let i = 0; i < wordLength; i++) {
      if (guess[i] === answerWord[i]) {
        letterStates[i] = 'correct';
        remainingAnswerLetters[i] = null;
      }
    }

    // Check for present letters
    for (let i = 0; i < wordLength; i++) { // Loop through the word length
      if (letterStates[i] === 'correct') continue; // If the tile state is correct, continue to the next iteration
      const idx = remainingAnswerLetters.indexOf(guess[i]); // Get the index of the guess letter in the secret copy
      if (idx !== -1) { // If the index is not -1, add the present class to the tile state
        letterStates[i] = 'present';
        remainingAnswerLetters[idx] = null; // Set the index of the guess letter in the secret copy to null
      }
    }

    // Check for absent letters
    for (let i = 0; i < wordLength; i++) {
      const tile = row.children[i];
      const letter = guess[i];

      setTimeout(() => {
        tile.style.transition = 'transform 0.3s ease';
        tile.style.transform = 'rotateX(90deg)';
        setTimeout(() => {
          tile.textContent = letter;
          tile.classList.add(letterStates[i]);
          tile.style.transform = 'rotateX(0deg)';
        }, 150);
      }, i * 300);
    }

    // Update the keyboard states
    updateKeyboardStates(guess, letterStates);

    if (guess === answerWord) {
      setTimeout(() => {
        showToast('You win!');
        showPlayAgainButton();
      }, wordLength * 300 + 300);
      return;
    }

    // Move to the next row
    currentRow++;
    currentGuess = '';

    if (currentRow >= maxAttempts) {
      setTimeout(() => {
        showToast(`Game over! The word was ${answerWord}`);
        showPlayAgainButton();
      }, wordLength * 300 + 300); // Show the play again button after the last guess
    } else {
      renderCurrentGuessRow(); // Update the current tiles in the current row
    }
  }

  // Update the keyboard states based on the guess
  function updateKeyboardStates(guess, letterStates) {
    guess.split('').forEach((letter, i) => {
      const keyButton = keyboard.querySelector(`[data-key="${letter}"]`);
      if (!keyButton) return;

      if (letterStates[i] === 'correct') { // Add the correct class to the key button
        keyButton.classList.add('correct');
      } else if (letterStates[i] === 'present') { // Add the present class to the key button
        keyButton.classList.add('present');
      } else { // Add the absent class to the key button
        keyButton.classList.add('absent');
      }
    }); // End of forEach loop
  }

  // Show the play again button
  function showPlayAgainButton() {
    playAgainContainer.style.display = 'block';
  }

  // Apply saved theme preference on load
  function initializeDarkMode() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    }
  }

  // Toggle between light and dark mode
  function toggleDarkMode() {
    document.documentElement.classList.toggle('dark');
    const theme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
    localStorage.setItem('theme', theme);
  }

  // === Event Listeners ===
  // Handle keyboard input
  document.addEventListener('keydown', (e) => {
    if (/^[a-zA-Z]$/.test(e.key) || e.key === 'Backspace' || e.key === 'Enter') {
      handleKeyInput(e.key);
      e.preventDefault();
    }
  });

  // Handle keyboard button clicks
  keyboard.addEventListener('click', (e) => {
    if (e.target.matches('.key')) {
      handleKeyInput(e.target.dataset.key);
    }
  });

  // Handle play again button click
  playAgainButton.addEventListener('click', initializeGame);

  // Handle dark mode toggle click
  darkModeToggle.addEventListener('click', toggleDarkMode);

  // === Initialization === //
  initializeDarkMode();
  initializeGame();
});
