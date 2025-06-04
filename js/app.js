window.addEventListener('DOMContentLoaded', () => {
  // === Constants === //
  const wordLength = 5;
  const maxAttempts = 6;

  // === Variables === //
  let currentRow = 0;
  let currentGuess = '';
  let hiddenWord = '';

  // === Cached Element References === //
  const board = document.getElementById('game-board');
  const keyboard = document.getElementById('keyboard');
  const playAgainContainer = document.getElementById('play-again-container');
  const playAgainButton = document.getElementById('play-again');

  // === Functions === //
  function initializeGame() {
    if (!window.wordList || wordList.length === 0) {
      window.wordList = [];
    }
    currentRow = 0;
    currentGuess = '';
    playAgainContainer.style.display = 'none';
    createBoard();
    setupKeyboard();
    chooseHiddenWord();
  }

  // Create the game board
  // Each row will contain the same number of tiles as the word length
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

  // Choose a random word from the word list
  function chooseHiddenWord() {
    const index = Math.floor(Math.random() * wordList.length);
    hiddenWord = wordList[index].toUpperCase();
    console.log('The hidden word is:', hiddenWord);
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
  function handleInput(key) {
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
    if (!wordList.includes(guess)) {
      showToast('Not in word list.');
      return;
    }

    // Check if the guess is correct
    const row = board.children[currentRow];
    const secretCopy = hiddenWord.split('');
    const tileStates = Array(wordLength).fill('absent');

    for (let i = 0; i < wordLength; i++) {
      if (guess[i] === hiddenWord[i]) {
        tileStates[i] = 'correct';
        secretCopy[i] = null;
      }
    }

    // Check for present letters
    for (let i = 0; i < wordLength; i++) {
      if (tileStates[i] === 'correct') continue;
      const idx = secretCopy.indexOf(guess[i]);
      if (idx !== -1) {
        tileStates[i] = 'present';
        secretCopy[idx] = null;
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
          tile.classList.add(tileStates[i]);
          tile.style.transform = 'rotateX(0deg)';
        }, 150);
      }, i * 300);
    }

    // Update the keyboard states
    updateKeyboardStates(guess, tileStates);

    if (guess === hiddenWord) {
      setTimeout(() => {
        showToast('You win!');
        showPlayAgain();
      }, wordLength * 300 + 300);
      return;
    }

    // Move to the next row
    currentRow++;
    currentGuess = '';

    if (currentRow >= maxAttempts) { 
      setTimeout(() => {
        showToast(`Game over! The word was ${hiddenWord}`);
        showPlayAgain();
      }, wordLength * 300 + 300); // Show the play again button after the last guess
    } else {
      updateCurrentTiles();
    }
  }

  // Update the keyboard states based on the guess
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

  // Show the play again button
  function showPlayAgain() {
    playAgainContainer.style.display = 'block';
  }

  // === Event Listeners ===
  // Handle keyboard input
  document.addEventListener('keydown', (e) => {
    if (/^[a-zA-Z]$/.test(e.key) || e.key === 'Backspace' || e.key === 'Enter') {
      handleInput(e.key);
      e.preventDefault();
    }
  });

  // Handle keyboard button clicks
  keyboard.addEventListener('click', (e) => {
    if (e.target.matches('.key')) {
      handleInput(e.target.dataset.key);
    }
  });

  // Handle play again button click
  playAgainButton.addEventListener('click', initializeGame);

  // === Initialization === //
  initializeGame();
});
