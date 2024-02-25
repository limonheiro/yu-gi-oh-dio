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

// tipo : pedra = 0 / papel = 1 / tesoura = 2
const cardData = [{
        id: 0,
        name: 'Blue Eyes White Dragon',
        numberType: 1,
        img: `${pathImages}dragon.png`,
    }, {
        id: 1,
        name: 'Mago Negro',
        numberType: 0,
        img: `${pathImages}magician.png`,
    },
    {
        id: 2,
        name: 'Exodia',
        numberType: 2,
        img: `${pathImages}exodia.png`,
    }
]

// pe = pedra
// pa = papel 
// te = tesoura
// 
// 0 = empate
// 1 = vitoria
// 2 = derrota
// 
//    pe pa te
// pe 0  1  2
// pa 1  0  2
// te 2  1  0

const resultado = [
    [0, 1, 2],
    [1, 0, 2],
    [2, 1, 0]
]

console.log(resultado[0][1])

const playersSider = {
    player1: 'player-cards',
    computer: 'computer-cards'
}

async function getRandomCardId() {
    const randomIndex = Math.floor(Math.random() * cardData.length);
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
    const Results = ['Empate', 'Venceu!', 'Perdeu!']
    const result = resultado[cardData[cardId].numberType][cardData[computerCardId].numberType]
    
    const duelResults = Results[result]
    playAudio(result);
    return duelResults
}

async function drawButton(duelResults) {
    state.actions.button.innerText = duelResults
    state.actions.button.style.display = 'block'
}

async function updateScore() {
    state.score.scoreBox.innerText = `Win : ${state.score.playerScore} | Lose : ${state.score.computerScore}`
}

async function resetDuel() {
    state.cardSprites.avatar.src = '';
    state.actions.button.style.display = 'none';

    state.fieldCards.player.style.display = 'none';
    state.fieldCards.computer.style.display = 'none';

    state.cardSprites.name.innerText = 'Selecione'
    state.cardSprites.type.innerText = 'uma carta!'

    init();
}

async function playAudio(status) {
    console.log(status)
    const file = ['draw', 'win', 'lose']
    const audio = new Audio(`./src/assets/audios/${file[status]}.wav`)
    audio.play()
}

async function showHiddenCard(status) {
    state.fieldCards.player.style.display = status;
    state.fieldCards.computer.style.display = status;
}

async function setCardsField(cardId) {
    await removeAllCardsImages();

    let computerCardId = await getRandomCardId();

    showHiddenCard('block');

    state.fieldCards.player.src = cardData[cardId].img;
    state.fieldCards.computer.src = cardData[computerCardId].img;

    const duelResults = await checkDuelResults(cardId, computerCardId);

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
    // tipo : pedra = 0 / papel = 1 / tesoura = 2
    const tipo = ['pedra','papel','tesoura']

    state.cardSprites.avatar.src = cardData[id].img;
    state.cardSprites.name.innerText = cardData[id].name;
    state.cardSprites.type.innerText = `Atributo: ${tipo[cardData[id].numberType]}`;
}

async function drawCards(cardNumbers, fieldSide) {
    for (let i = 0; i < cardNumbers; i++) {
        const randomIdCard = await getRandomCardId();
        const cardImage = await creatCardImage(randomIdCard, fieldSide);
        document.getElementById(fieldSide).appendChild(cardImage)
    }
}

function init() {
    showHiddenCard('none');

    drawCards(5, playersSider.player1);
    drawCards(5, playersSider.computer);
}
document.getElementById("bgm").play();
init();