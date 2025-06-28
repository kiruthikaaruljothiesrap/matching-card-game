document.addEventListener('DOMContentLoaded', () => {
  const board = document.getElementById('game-board');
  const message = document.getElementById('message');
  const stats = document.getElementById('stats');
  const startBtn = document.getElementById('startButton');
  const difficultySelect = document.getElementById('difficulty');

  let firstCard, secondCard;
  let lockBoard = false;
  let matches = 0;
  let moves = 0;
  let timer = 0;
  let interval;

  const images = ['1.png','2.png','3.png','4.png','5.png','6.png','7.png','8.png'];

  startBtn.addEventListener('click', () => {
    startGame(difficultySelect.value);
  });

  function startGame(difficulty) {
    let totalCards = 8;
    if (difficulty === 'medium') totalCards = 16;
    else if (difficulty === 'hard') totalCards = 24;

    resetBoard();

    const selectedImages = images.slice(0, totalCards / 2);
    const cards = [...selectedImages, ...selectedImages];
    shuffle(cards);

    board.innerHTML = '';
    board.style.gridTemplateColumns = `repeat(${Math.sqrt(totalCards)}, 1fr)`;

    cards.forEach(img => {
      const card = document.createElement('div');
      card.classList.add('card');
      card.dataset.img = img;

      const imgElement = document.createElement('img');
      imgElement.src = `images/${img}`;
      imgElement.alt = "Card";
      imgElement.style.display = 'none';

      card.appendChild(imgElement);
      card.addEventListener('click', flipCard);
      board.appendChild(card);
    });

    interval = setInterval(() => {
      timer++;
      updateStats();
    }, 1000);
  }

  function flipCard() {
    if (lockBoard || this === firstCard || this.classList.contains('matched')) return;

    this.classList.add('flipped');
    this.querySelector('img').style.display = 'block';

    if (!firstCard) {
      firstCard = this;
      return;
    }

    secondCard = this;
    lockBoard = true;
    moves++;
    updateStats();

    if (firstCard.dataset.img === secondCard.dataset.img) {
      firstCard.classList.add('matched');
      secondCard.classList.add('matched');
      matches++;
      if (matches === board.childNodes.length / 2) {
        message.innerText = `🎉 You won in ${moves} moves and ${timer} seconds!`;
        clearInterval(interval);
      }
      resetFlips();
    } else {
      setTimeout(() => {
        firstCard.classList.remove('flipped');
        secondCard.classList.remove('flipped');
        firstCard.querySelector('img').style.display = 'none';
        secondCard.querySelector('img').style.display = 'none';
        resetFlips();
      }, 1000);
    }
  }

  function resetFlips() {
    [firstCard, secondCard] = [null, null];
    lockBoard = false;
  }

  function resetBoard() {
    clearInterval(interval);
    timer = 0;
    moves = 0;
    matches = 0;
    board.innerHTML = '';
    message.innerText = '';
    updateStats();
  }

  function updateStats() {
    stats.innerText = `Moves: ${moves} | Time: ${timer}s`;
  }

  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }
});