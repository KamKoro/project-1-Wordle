window.addEventListener('DOMContentLoaded', () => {
  // === Constants === //
  const wordLength = window.WORD_LEN || 5;
  const maxAttempts = 6;
  const FLIP_MS = 300;
  const STAGGER_MS = 300;

  // === Variables === //
  let currentRow = 0;
  let currentGuess = '';
  let hiddenWord = '';
  let isAnimating = false;
  let isGameOver = false;

  // === Cached Element References === //
  const board = document.getElementById('game-board');
  const keyboard = document.getElementById('keyboard');
  const playAgainContainer = document.getElementById('play-again-container');
  const playAgainButton = document.getElementById('play-again');

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
    currentRow = 0;
    currentGuess = '';
    isAnimating = false;
    isGameOver = false;

    playAgainContainer.style.display = 'none';
    createBoard();
    setupKeyboard();  
    chooseHiddenWord();
  }

  function createBoard() {
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

  function chooseHiddenWord() {
    const index = Math.floor(Math.random() * wordList.length);
    hiddenWord = wordList[index].toUpperCase();
    console.log('The hidden word is:', hiddenWord);
  }

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
  function handleInput(key) {
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
    updateCurrentTiles();
  }

  // Update the current tiles in the current row
  function updateCurrentTiles() {
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

    if (!wordList.includes(guess)) {
      showToast('Not in word list.');
      shakeRow(row);
      return;
    }

    const row = board.children[currentRow];
    const secretCopy = hiddenWord.split('');
    const tileStates = Array(wordLength).fill('absent');

    // First pass — greens
    for (let i = 0; i < wordLength; i++) {
      if (guess[i] === hiddenWord[i]) {
        tileStates[i] = 'correct';
        secretCopy[i] = null;
      }
    }

    for (let i = 0; i < wordLength; i++) {
      if (tileStates[i] === 'correct') continue;
      const idx = secretCopy.indexOf(guess[i]);
      if (idx !== -1) {
        tileStates[i] = 'present';
        secretCopy[idx] = null;
      }
    }

    for (let i = 0; i < wordLength; i++) {
      const tile = row.children[i];
      const letter = guess[i];

      setTimeout(() => {
        tile.style.transition = 'transform 0.3s ease';
        tile.style.transform = 'rotateX(90deg)';
        setTimeout(() => {
          tile.textContent = letter;
          tile.classList.add(tileStates[i]);
          tile.style.transform = 'rotateX(0deg)';
        }, 150);
      }, i * 300);
    }

    updateKeyboardStates(guess, tileStates);

      if (guess === hiddenWord) {
        isGameOver = true;
        showToast('You win!');
        showPlayAgain();
        return;
      }

    currentRow++;
    currentGuess = '';

    if (currentRow >= maxAttempts) {
      setTimeout(() => {
        showToast(`Game over! The word was ${hiddenWord}`);
        showPlayAgain();
      }, wordLength * 300 + 300);
    } else {
      updateCurrentTiles();
    }
  }

  function updateKeyboardStates(guess, tileStates) {
    guess.split('').forEach((letter, i) => {
      const keyButton = keyboard.querySelector(`[data-key="${letter}"]`);
      if (!keyButton) return;

      if (tileStates[i] === 'correct') {
        keyButton.classList.add('correct');
      } else if (tileStates[i] === 'present') {
        keyButton.classList.add('present');
      } else {
        keyButton.classList.add('absent');
      }
    });
  }

  function showPlayAgain() {
    playAgainContainer.style.display = 'block';
  }

  // === Event Listeners ===
  // Handle keyboard input
  document.addEventListener('keydown', (e) => {
    const k = e.key;
    if (/^[a-zA-Z]$/.test(k) || k === 'Backspace' || k === 'Enter') {
      handleInput(k);
      e.preventDefault();
    }
  });

  keyboard.addEventListener('click', (e) => {
    const btn = e.target.closest('.key');
    if (!btn) return;
    handleInput(btn.dataset.key);
  });

  // Handle play again button click
  playAgainButton.addEventListener('click', initializeGame);

  // === Initialization === //
  initializeGame();
});
