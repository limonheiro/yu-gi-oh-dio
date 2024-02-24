const state = {
    score: {
        playerScore: 0,
        computerScore: 0,
        scoreBox: document.getElementById('score_points')
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
    actions: {
        button: document.getElementById('next-duel'),
    }
};
const pathImages = "./src/assets/icons/"

const cardData = [{
        id: 0,
        name: 'Blue Eyes White Dragon',
        type: 'Papel',
        // src\assets\icons\eye.jpg
        img: `${pathImages}dragon.png`,
        WinOf: [1],
        Loseof: [2]
    }, {
        id: 1,
        name: 'Mago Negro',
        type: 'Pedra',
        // src\assets\icons\eye.png
        img: `${pathImages}magician.png`,
        WinOf: [2],
        Loseof: [0]
    },
    {
        id: 2,
        name: 'Exodia',
        type: 'Tesoura',
        // src\assets\icons\eye.png
        img: `${pathImages}exodia.png`,
        WinOf: [0],
        Loseof: [1]
    }
]

const playersSider = {
    player1: 'player-cards',
    computer: 'computer-cards'
}

async function getRandomCardId() {
    const randomIndex = Math.floor(Math.random() * cardData.length);
    // return cardData[randomIndex];
    return randomIndex
}

async function removeAllCardsImages() {
    for (const player of Object.values(playersSider)) {
        const cards = document.querySelector('#' + player);
        const imgElements = cards.querySelectorAll('img');
        imgElements.forEach((img) => {
            img.remove();
        });
    }

}

async function checkDuelResults(cardId, computerCardId) {
    const player = cardData[cardId];
    let duelResults = 'Empate';


    if (player.WinOf.includes(computerCardId)) {
        state.score.playerScore++;
        duelResults = 'Venceu!';
        playAudio('win')
    } else if(player.Loseof.includes(computerCardId)) {
        state.score.computerScore++;
        duelResults = 'Perdeu!';
        playAudio('lose')
    }

    return duelResults
}

async function drawButton(duelResults) {
    state.actions.button.innerText = duelResults
    state.actions.button.style.display = 'block'
}

async function updateScore() {
    state.score.scoreBox.innerText = `Win : ${state.score.playerScore} | Lose : ${state.score.computerScore}`
}

async function resetDuel(){
    state.cardSprites.avatar.src = '';
    state.actions.button.style.display = 'none';

    state.fieldCards.player.style.display = 'none';
    state.fieldCards.computer.style.display = 'none';

    state.cardSprites.name.innerText = 'Selecione'
    state.cardSprites.type.innerText = 'uma carta!'

    init();
}

async function playAudio(status){
    const audio  = new Audio(`./src/assets/audios/${status}.wav`)
    audio.play()
}

async function setCardsField(cardId) {
    await removeAllCardsImages();

    let computerCardId = await getRandomCardId();

    state.fieldCards.player.style.display = 'block';
    state.fieldCards.computer.style.display = 'block';

    state.fieldCards.player.src = cardData[cardId].img;
    state.fieldCards.computer.src = cardData[computerCardId].img;

    const duelResults = await checkDuelResults(cardId, computerCardId);
    console.log(duelResults)

    await updateScore();
    await drawButton(duelResults);
}

async function creatCardImage(IdCard, fieldSide) {
    const cardImage = document.createElement('img');
    cardImage.setAttribute('height', '100px');
    cardImage.setAttribute('src', `${pathImages}card-back.png`);
    cardImage.setAttribute('data-id', IdCard);
    cardImage.classList.add('card');

    if (fieldSide === playersSider.player1) {
        cardImage.addEventListener('mouseover', () => {
            drawSelectCard(IdCard);
        });
        cardImage.addEventListener('click', () => {
            setCardsField(cardImage.getAttribute('data-id'));
        });
    };



    return cardImage
}

async function drawSelectCard(id) {
    // console.log(cardData, 'id'+id)
    state.cardSprites.avatar.src = cardData[id].img;
    state.cardSprites.name.innerText = cardData[id].name;
    state.cardSprites.type.innerText = `Atributo: ${cardData[id].type}`;
}

async function drawCards(cardNumbers, fieldSide) {
    for (let i = 0; i < cardNumbers; i++) {
        const randomIdCard = await getRandomCardId();
        const cardImage = await creatCardImage(randomIdCard, fieldSide);
        // console.log(fieldSide)
        document.getElementById(fieldSide).appendChild(cardImage)
    }
}

function init() {
    playAudio('egyptian_duel')
    drawCards(5, playersSider.player1);
    drawCards(5, playersSider.computer);
}
init();