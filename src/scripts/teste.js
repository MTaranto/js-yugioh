const state = {
  score: {
    playerScore: 0,
    computerScore: 0,
    scoreBox: document.getElementById('score-points'),
  },
  cardSprites: {
    avatar: document.getElementById('card-image'),
    name: document.getElementById('card-name'),
    type: document.getElementById('card-type'),
  },
  fieldCards: {
    player: document.getElementById('player-field-card'),
    computer: document.getElementById('computer-field-card'),
  },
  playerSides: {
    player1: 'player-cards',
    computer: 'computer-cards',
  },
  actions: {
    button: document.getElementById('next-duel'),
  },
};

const pathImages = './src/assets/icons/';

const cardData = [
  {
    id: 0,
    name: 'Blue Eyes White Dragon',
    type: 'Paper',
    img: `${pathImages}dragon.png`,
    WinOf: [1],
    LoseOf: [2],
  },
  {
    id: 1,
    name: 'Dark Magician',
    type: 'Rock',
    img: `${pathImages}magician.png`,
    WinOf: [2],
    LoseOf: [0],
  },
  {
    id: 2,
    name: 'Exodia',
    type: 'Scissors',
    img: `${pathImages}exodia.png`,
    WinOf: [0],
    LoseOf: [1],
  },
];

const getRandomCardId = () => Math.floor(Math.random() * cardData.length);

const createCardImage = (IdCard, fieldSide) => {
  const cardImage = document.createElement('img');
  cardImage.height = 100;
  cardImage.src = `${pathImages}card-back.png`;
  cardImage.dataset.id = IdCard;
  cardImage.classList.add('card');

  if (fieldSide === state.playerSides.player1) {
    cardImage.addEventListener('mouseover', () => drawSelectedCard(IdCard));
    cardImage.addEventListener('click', () => setCardsField(cardImage.dataset.id));
  }
  return cardImage;
};

const setCardsField = (cardId) => {
  removeAllCardsImages();

  const computerCardId = getRandomCardId();
  const { player, computer } = state.fieldCards;

  player.classList.add('active');
  computer.classList.add('active');
  player.style.display = 'block';
  computer.style.display = 'block';

  player.src = cardData[cardId].img;
  computer.src = cardData[computerCardId].img;

  const duelResults = checkDuelResults(cardId, computerCardId);
  updateScore();
  drawButton(duelResults);
};

const updateScore = () => {
  const { playerScore, computerScore, scoreBox } = state.score;
  scoreBox.innerHTML = `Victories: ${playerScore} <br><br> Defeats: ${computerScore}`;
};

const drawButton = (text) => {
  const { button } = state.actions;
  button.innerText = text;
  button.style.display = 'block';
};

const checkDuelResults = (playerCardId, computerCardId) => {
  const playerCard = cardData[playerCardId];
  let duelResults = 'Tie';

  if (playerCard.WinOf.includes(computerCardId)) {
    duelResults = 'Victory';
    state.score.playerScore++;
  } else if (playerCard.LoseOf.includes(computerCardId)) {
    duelResults = 'Defeated';
    state.score.computerScore++;
  }

  playAudio(duelResults);
  return duelResults;
};

const removeAllCardsImages = () => {
  const { computer, player1 } = state.playerSides;
  [computer, player1].forEach((side) => {
    const imgElements = document.getElementById(side).querySelectorAll('img');
    imgElements.forEach((img) => img.remove());
  });
};

const drawSelectedCard = (index) => {
  const { avatar, name, type } = state.cardSprites;
  avatar.src = cardData[index].img;
  name.innerText = cardData[index].name;
  type.innerText = `Attribute: ${cardData[index].type}`;
};

const drawCards = (cardNumbers, fieldSide) => {
  Array.from({ length: cardNumbers }).forEach(() => {
    const randomIdCard = getRandomCardId();
    const cardImage = createCardImage(randomIdCard, fieldSide);
    document.getElementById(fieldSide).appendChild(cardImage);
  });
};

const resetDuel = () => {
  const { avatar, name, type } = state.cardSprites;
  avatar.src = '';
  name.innerText = 'Monster';
  type.innerText = 'Attribute';
  state.actions.button.style.display = 'none';
  state.fieldCards.player.removeAttribute('src');
  state.fieldCards.computer.removeAttribute('src');

  state.fieldCards.player.classList.remove('active');
  state.fieldCards.computer.classList.remove('active');

  init();
};

const playAudio = (status) => {
  const audio = new Audio(`./src/assets/audios/${status}.wav`);
  audio.play();
};

const init = () => {
  drawCards(5, state.playerSides.player1);
  drawCards(5, state.playerSides.computer);
};

init();