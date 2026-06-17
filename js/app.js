window.addEventListener('DOMContentLoaded', () => {
  // === Constants === //
  const wordLength = window.WORD_LEN || 5;
  const maxAttempts = 6;
  const FLIP_MS = 300;
  const STAGGER_MS = 300;

  // === Variables === //
  let currentRow = 0;
  let currentGuess = '';
<<<<<<< HEAD
  let answerWord = '';
=======
  let hiddenWord = '';
  let isAnimating = false;
  let isGameOver = false;
>>>>>>> 1524fedac051669a33006c3ef34d1cc899976572

  // === Cached Element References === //
  // === Cached Element References === //
  const board = document.getElementById('game-board');
  const keyboard = document.getElementById('keyboard');
  const playAgainContainer = document.getElementById('play-again-container');
  const playAgainButton = document.getElementById('play-again');
  const darkModeToggle = document.getElementById('dark-mode-toggle');

  // === Helpers === //
  const allowedSet = window.ALLOWED_SET || new Set();
  const solutions = (window.SOLUTIONS || []).map(s => s.toUpperCase());

  function pickSolution() {
    // Use daily or random — toggle which line you prefer
    // return window.solutionForDate ? window.solutionForDate(new Date()) : pickRandom();
    return window.pickRandomSolution ? window.pickRandomSolution() : pickRandom();
  }
  function pickRandom() {
    if (!solutions.length) return '';
    const i = Math.floor(Math.random() * solutions.length);
    return solutions[i];
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

    const prev = btn.dataset.state; // undefined | 'absent' | 'present' | 'correct'

    // First time setting any state for this key
    if (!prev) {
      btn.dataset.state = newState;
      btn.classList.add(newState);
      return;
    }

    // Only upgrade (never downgrade)
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
<<<<<<< HEAD
    if (!window.allowedWords || allowedWords.length === 0) {
      window.allowedWords = [];
    }
=======
>>>>>>> 1524fedac051669a33006c3ef34d1cc899976572
    currentRow = 0;
    currentGuess = '';
    isAnimating = false;
    isGameOver = false;

    playAgainContainer.style.display = 'none';
    renderBoard();
    setupKeyboard();
<<<<<<< HEAD
    pickAnswerWord();
  }

  // Create the game board
  // Each row will contain the same number of tiles as the word length
  function renderBoard() {
=======
    resetKeyboardVisuals();

    hiddenWord = pickSolution();
    if (!hiddenWord) {
      showToast('No solutions loaded.');
      isGameOver = true;
      return;
    }
    // Dev aid: reveal in console
    console.log('The hidden word is:', hiddenWord);
  }

  // Create the game board
  function createBoard() {
>>>>>>> 1524fedac051669a33006c3ef34d1cc899976572
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

<<<<<<< HEAD
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

=======
>>>>>>> 1524fedac051669a33006c3ef34d1cc899976572
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
<<<<<<< HEAD
  function handleKeyInput(key) {
=======
  // Handle keyboard input
  function handleInput(key) {
    if (isAnimating || isGameOver) return;

>>>>>>> 1524fedac051669a33006c3ef34d1cc899976572
    key = key.toUpperCase();

    // Handle special keys
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
<<<<<<< HEAD
  function renderCurrentGuessRow() {
=======
  // Update the current tiles in the current row
  function updateCurrentTiles() {
>>>>>>> 1524fedac051669a33006c3ef34d1cc899976572
    const row = board.children[currentRow];
    if (!row) return;
    for (let i = 0; i < wordLength; i++) {
      const tile = row.children[i];
      tile.textContent = currentGuess[i] || '';
    }
  }

  // Show a toast message
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

<<<<<<< HEAD
    // Check if the guess is in the word list
    if (!allowedWords.includes(guess)) {
=======
    if (!allowedSet.has(guess)) {
>>>>>>> 1524fedac051669a33006c3ef34d1cc899976572
      showToast('Not in word list.');
      shakeRow(row);
      return;
    }

<<<<<<< HEAD
    // Check if the guess is correct
    const row = board.children[currentRow];
    const remainingAnswerLetters = answerWord.split('');
    const letterStates = Array(wordLength).fill('absent');
=======
    // Compute tile states
    const secretCopy = hiddenWord.split('');
    const tileStates = Array(wordLength).fill('absent');
>>>>>>> 1524fedac051669a33006c3ef34d1cc899976572

    // First pass — greens
    for (let i = 0; i < wordLength; i++) {
      if (guess[i] === answerWord[i]) {
        letterStates[i] = 'correct';
        remainingAnswerLetters[i] = null;
      }
    }

<<<<<<< HEAD
    // Check for present letters
    for (let i = 0; i < wordLength; i++) { // Loop through the word length
      if (letterStates[i] === 'correct') continue; // If the tile state is correct, continue to the next iteration
      const idx = remainingAnswerLetters.indexOf(guess[i]); // Get the index of the guess letter in the secret copy
      if (idx !== -1) { // If the index is not -1, add the present class to the tile state
        letterStates[i] = 'present';
        remainingAnswerLetters[idx] = null; // Set the index of the guess letter in the secret copy to null
=======
    // Second pass — yellows
    for (let i = 0; i < wordLength; i++) {
      if (tileStates[i] === 'correct') continue;
      const idx = secretCopy.indexOf(guess[i]);
      if (idx !== -1) {
        tileStates[i] = 'present';
        secretCopy[idx] = null;
>>>>>>> 1524fedac051669a33006c3ef34d1cc899976572
      }
    }

    // Animate flip
    isAnimating = true;
    for (let i = 0; i < wordLength; i++) {
      const tile = row.children[i];
      const letter = guess[i];
<<<<<<< HEAD

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
=======
      flipTile(tile, letter, tileStates[i], i);
    }

    // After animation finishes…
    setTimeout(() => {
      isAnimating = false;

      // Update keyboard (best-per-letter for this guess)
      updateKeyboardStates(guess, tileStates);

      if (guess === hiddenWord) {
        isGameOver = true;
        showToast('You win!');
        showPlayAgain();
        return;
      }
>>>>>>> 1524fedac051669a33006c3ef34d1cc899976572

      currentRow++;
      currentGuess = '';

<<<<<<< HEAD
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
=======
      if (currentRow >= maxAttempts) {
        isGameOver = true;
        showToast(`Game over! The word was ${hiddenWord}`);
        showPlayAgain();
      } else {
        updateCurrentTiles();
      }
    }, wordLength * STAGGER_MS + FLIP_MS + 50);
  }

  // Update the keyboard states based on this single guess:
  // pick the best state per letter (correct > present > absent),
  // then apply it with the no-downgrade rule.
  function updateKeyboardStates(guess, tileStates) {
    const best = new Map(); // letter -> best state seen this guess

    for (let i = 0; i < guess.length; i++) {
      const letter = guess[i];
      const state = tileStates[i]; // 'correct' | 'present' | 'absent'
      const prev = best.get(letter);
      if (!prev || keyRank[state] > keyRank[prev]) {
        best.set(letter, state);
      }
    }

    for (const [letter, state] of best) {
      setKeyState(letter, state);
    }
>>>>>>> 1524fedac051669a33006c3ef34d1cc899976572
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
  // Handle keyboard input
  document.addEventListener('keydown', (e) => {
<<<<<<< HEAD
    if (/^[a-zA-Z]$/.test(e.key) || e.key === 'Backspace' || e.key === 'Enter') {
      handleKeyInput(e.key);
=======
    const k = e.key;
    if (/^[a-zA-Z]$/.test(k) || k === 'Backspace' || k === 'Enter') {
      handleInput(k);
>>>>>>> 1524fedac051669a33006c3ef34d1cc899976572
      e.preventDefault();
    }
  });

  // Handle on-screen keyboard button clicks
  keyboard.addEventListener('click', (e) => {
<<<<<<< HEAD
    if (e.target.matches('.key')) {
      handleKeyInput(e.target.dataset.key);
    }
=======
    const btn = e.target.closest('.key');
    if (!btn) return;
    handleInput(btn.dataset.key);
>>>>>>> 1524fedac051669a33006c3ef34d1cc899976572
  });

  // Handle play again button click
  // Handle play again button click
  playAgainButton.addEventListener('click', initializeGame);

  // Handle dark mode toggle click
  darkModeToggle.addEventListener('click', toggleDarkMode);

  // === Initialization === //
<<<<<<< HEAD
  initializeDarkMode();
=======
  // === Initialization === //
>>>>>>> 1524fedac051669a33006c3ef34d1cc899976572
  initializeGame();
});
