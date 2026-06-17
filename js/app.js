window.addEventListener('DOMContentLoaded', () => {
  // === Constants === //
  const wordLength = window.WORD_LEN || 5;
  const maxAttempts = 6;
  const FLIP_MS = 300;
  const STAGGER_MS = 300;

  // === Variables === //
  let currentRow = 0;
  let currentGuess = '';
  let answerWord = '';
  let isAnimating = false;
  let isGameOver = false;

  // === Cached Element References === //
  const board = document.getElementById('game-board');
  const keyboard = document.getElementById('keyboard');
  const playAgainContainer = document.getElementById('play-again-container');
  const playAgainButton = document.getElementById('play-again');
  const darkModeToggle = document.getElementById('dark-mode-toggle');

  // === Helpers === //
  const allowedSet = window.ALLOWED_SET || new Set();

  function pickSolution() {
    // Use daily or random — toggle which line you prefer
    // return window.solutionForDate ? window.solutionForDate(new Date()) : window.pickRandomSolution();
    return window.pickRandomSolution ? window.pickRandomSolution() : '';
  }

  function flipTile(tile, letter, state, i) {
    setTimeout(() => {
      tile.style.transition = `transform ${FLIP_MS}ms ease`;
      tile.style.transform = 'rotateX(90deg)';
      setTimeout(() => {
        tile.textContent = letter;
        tile.classList.add(state);
        tile.style.transform = 'rotateX(0deg)';
      }, FLIP_MS / 2);
    }, i * STAGGER_MS);
  }

  function shakeRow(rowEl) {
    rowEl.classList.add('shake');
    setTimeout(() => rowEl.classList.remove('shake'), 500);
  }

  const keyRank = { absent: 0, present: 1, correct: 2 };
  function setKeyState(letter, newState) {
    const btn = keyboard.querySelector(`[data-key="${letter}"]`);
    if (!btn) return;

    const prev = btn.dataset.state;

    if (!prev) {
      btn.dataset.state = newState;
      btn.classList.add(newState);
      return;
    }

    if (keyRank[newState] > keyRank[prev]) {
      btn.dataset.state = newState;
      btn.classList.remove('absent', 'present', 'correct');
      btn.classList.add(newState);
    }
  }

  function resetKeyboardVisuals() {
    keyboard.querySelectorAll('.key').forEach(btn => {
      btn.dataset.state = '';
      btn.classList.remove('absent', 'present', 'correct');
    });
  }

  // === Functions === //
  function initializeGame() {
    currentRow = 0;
    currentGuess = '';
    isAnimating = false;
    isGameOver = false;

    playAgainContainer.style.display = 'none';
    renderBoard();
    setupKeyboard();
    resetKeyboardVisuals();

    answerWord = pickSolution();
    if (!answerWord) {
      showToast('No solutions loaded.');
      isGameOver = true;
      return;
    }
    console.log('The answer word is:', answerWord);
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
    if (isAnimating || isGameOver) return;
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
    if (!row) return;
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
    const row = board.children[currentRow];

    if (!row) return;

    if (guess.length !== wordLength) {
      showToast(`Enter a ${wordLength}-letter word.`);
      shakeRow(row);
      return;
    }

    // Check if the guess is in the word list
    if (!allowedSet.has(guess)) {
      showToast('Not in word list.');
      shakeRow(row);
      return;
    }

    // Check if the guess is correct
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

    isAnimating = true;
    for (let i = 0; i < wordLength; i++) {
      const tile = row.children[i];
      const letter = guess[i];
      flipTile(tile, letter, letterStates[i], i);
    }

    // Update the keyboard states after the flip animation
    setTimeout(() => {
      isAnimating = false;
      updateKeyboardStates(guess, letterStates);

      if (guess === answerWord) {
        isGameOver = true;
        showToast('You win!');
        showPlayAgainButton();
        return;
      }

      // Move to the next row
      currentRow++;
      currentGuess = '';

      if (currentRow >= maxAttempts) {
        isGameOver = true;
        showToast(`Game over! The word was ${answerWord}`);
        showPlayAgainButton();
      } else {
        renderCurrentGuessRow(); // Update the current tiles in the current row
      }
    }, wordLength * STAGGER_MS + FLIP_MS + 50);
  }

  // Update the keyboard states based on the guess
  function updateKeyboardStates(guess, letterStates) {
    const best = new Map();

    for (let i = 0; i < guess.length; i++) {
      const letter = guess[i];
      const state = letterStates[i];
      const prev = best.get(letter);
      if (!prev || keyRank[state] > keyRank[prev]) {
        best.set(letter, state);
      }
    }

    for (const [letter, state] of best) {
      setKeyState(letter, state);
    }
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
    const btn = e.target.closest('.key');
    if (!btn) return;
    handleKeyInput(btn.dataset.key);
  });

  // Handle play again button click
  playAgainButton.addEventListener('click', initializeGame);

  // Handle dark mode toggle click
  darkModeToggle.addEventListener('click', toggleDarkMode);

  // === Initialization === //
  initializeDarkMode();
  initializeGame();
});
