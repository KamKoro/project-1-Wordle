window.addEventListener('DOMContentLoaded', () => {
  // === Constants === //
  const wordLength = 5;
  const maxAttempts = 6;

  // === Variables === //
  let currentRow = 0;
  let currentGuess = '';
  let hiddenWord = '';

  // ===  Cached Element References === //
  const board = document.getElementById('game-board');
  const keyboard = document.getElementById('keyboard');
  const playAgainContainer = document.getElementById('play-again-container');
  const playAgainButton = document.getElementById('play-again');
  const themeToggle = document.getElementById('theme-toggle');

  // === Theme Toggle Functionality === //
  function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      document.documentElement.classList.add('dark-mode');
      document.body.classList.add('dark-mode');
    }
    updateThemeIcon();
  }

  function updateThemeIcon() {
    const themeIcon = document.querySelector('.theme-icon');
    if (themeIcon) {
      themeIcon.textContent = document.body.classList.contains('dark-mode') ? '☀️' : '🌙';
    }
  }

  function toggleTheme(e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    console.log('toggleTheme called');
    console.log('Before toggle - has dark-mode:', document.body.classList.contains('dark-mode'));
    
    // Toggle on both html and body for maximum compatibility
    document.documentElement.classList.toggle('dark-mode');
    document.body.classList.toggle('dark-mode');
    
    const isDark = document.body.classList.contains('dark-mode');
    console.log('After toggle - has dark-mode:', isDark);
    console.log('Body classes:', document.body.className);
    console.log('HTML classes:', document.documentElement.className);
    
    // Check computed styles
    const computedBg = window.getComputedStyle(document.body).backgroundColor;
    const computedColor = window.getComputedStyle(document.body).color;
    console.log('Computed background:', computedBg);
    console.log('Computed color:', computedColor);
    
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    updateThemeIcon();
    console.log('Theme toggled to:', isDark ? 'dark' : 'light');
    
    // Force a repaint to ensure CSS updates
    document.body.offsetHeight;
  }

  // Initialize theme on page load
  initTheme();
  
  // Make toggleTheme available globally for onclick fallback
  window.toggleThemeManual = function() {
    console.log('Manual toggle called');
    toggleTheme();
  };

  // Attach event listener to theme toggle button
  if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
    console.log('Theme toggle button found and listener attached');
  } else {
    console.error('Theme toggle button not found');
  }
  
  // Test function to manually toggle theme
  window.testTheme = function() {
    console.log('Testing theme toggle...');
    document.body.classList.toggle('dark-mode');
    console.log('Dark mode:', document.body.classList.contains('dark-mode'));
    console.log('Computed background:', window.getComputedStyle(document.body).backgroundColor);
    console.log('Computed color:', window.getComputedStyle(document.body).color);
  };

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

    keyboard.innerHTML = layout
      .map(row => `
        <div class="row">
          ${row.map(key => `<button class="key" data-key="${key}">${key}</button>`).join('')}
        </div>
      `)
      .join('');
  }

  function handleInput(key) {
    key = key.toUpperCase();

    if (key === 'BACKSPACE' || key === '⌫') {
      currentGuess = currentGuess.slice(0, -1);
    } else if (key === 'ENTER') {
      handleGuess();
      return;
    } else if (/^[A-Z]$/.test(key) && currentGuess.length < wordLength) {
      currentGuess += key;
    }

    updateCurrentTiles();
  }

  function updateCurrentTiles() {
    const row = board.children[currentRow];
    for (let i = 0; i < wordLength; i++) {
      const tile = row.children[i];
      tile.textContent = currentGuess[i] || '';
    }
  }

  function showToast(message, duration = 3000) {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toast-message');

    toastMessage.textContent = message;
    toast.classList.add('show');

    setTimeout(() => {
      toast.classList.remove('show');
    }, duration);
  }

  function handleGuess() {
    const guess = currentGuess.toUpperCase();
    if (guess.length !== wordLength) {
      showToast(`Enter a ${wordLength}-letter word.`);
      return;
    }

    if (!wordList.includes(guess)) {
      showToast('Not in word list.');
      return;
    }

    const row = board.children[currentRow];
    const secretCopy = hiddenWord.split('');
    const tileStates = Array(wordLength).fill('absent');

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
      setTimeout(() => {
        showToast('You win!');
        showPlayAgain();
      }, wordLength * 300 + 300);
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
  document.addEventListener('keydown', (e) => {
    if (/^[a-zA-Z]$/.test(e.key) || e.key === 'Backspace' || e.key === 'Enter') {
      handleInput(e.key);
      e.preventDefault();
    }
  });

  keyboard.addEventListener('click', (e) => {
    if (e.target.matches('.key')) {
      handleInput(e.target.dataset.key);
    }
  });

  playAgainButton.addEventListener('click', initializeGame);

  // === Initialization === // 
  initializeGame();
});
