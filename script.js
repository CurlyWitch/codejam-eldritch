import AncientsData from './data/ancients.js'
import Difficulties from './data/difficulties.js'
import GreenCards from './data/mythicCards/green/index.js'
import BrownCards from './data/mythicCards/brown/index.js'
import BlueCards from './data/mythicCards/blue/index.js'

window.activeAncient = {}

window.difficulty = "normal";

window.firstStage = {
    name: "Первая стадия"
}
window.secondStage = {
    name: "Вторая стадия"
}
window.thirdStage = {
    name: "Третья стадия"
}

function init() {
    initAncient();
    Array.from(document.getElementsByClassName('ancient-card')).forEach(e => e.addEventListener('click', clickAncient));
}

init();

function initAncient() {
    Object.values(AncientsData).forEach(e => {
        const div = document.createElement("div");
        div.classList.add("ancient-card");
        div.id = e.id;
        div.style.backgroundImage = `url('${e.cardFace}')`;
        document.querySelector('.ancients-container').appendChild(div);
    })
}

function initDifficulties() {
    clear(1);
    Object.values(Difficulties).forEach(e => {
        const div =  document.createElement("div");
        div.classList.add("difficulty");
        div.id = e.id;
        div.textContent = e.name; 
        div.addEventListener('click', clickDifficulty); 
        document.querySelector('.difficulty-container').appendChild(div);
    })
}

function initButtonDeckShuffle() {
    clear(2);
    const span = document.createElement("span");
    span.classList.add("shuffle-button");
    span.textContent = 'Замешать колоду';
    span.addEventListener('click', deckShuffle); 
    document.querySelector('.deck-container').appendChild(span);
}

function deckShuffle() {
    clear(2);
    const deckContainer = document.querySelector('.deck-container');
    const currentState = document.createElement("div");
    currentState.classList.add("current-state");

    const countGreenCards = window.activeAncient.firstStage.greenCards + window.activeAncient.secondStage.greenCards + window.activeAncient.thirdStage.greenCards;
    const countBrownCards = window.activeAncient.firstStage.brownCards + window.activeAncient.secondStage.brownCards + window.activeAncient.thirdStage.brownCards;
    const countBlueCards = window.activeAncient.firstStage.blueCards + window.activeAncient.secondStage.blueCards + window.activeAncient.thirdStage.blueCards;
    
    let greenCards = [];
    let filterGreenCards = filterCards(GreenCards, "greenCards");
    for(let i = 1; i <= countGreenCards; i++) {
        greenCards.push(filterGreenCards.splice([Math.floor(Math.random() * filterGreenCards.length)], 1)[0]);
    }

    let brownCards = [];
    let filterBrownCards = filterCards(BrownCards, "brownCards");
    for(let i = 1; i <= countBrownCards; i++) {
        brownCards.push(filterBrownCards.splice([Math.floor(Math.random() * filterBrownCards.length)], 1)[0]);
    }

    let blueCards = [];
    let filterBlueCards = filterCards(BlueCards, "blueCards");
    for(let i = 1; i <= countBlueCards; i++) {
        blueCards.push(filterBlueCards.splice([Math.floor(Math.random() * filterBlueCards.length)], 1)[0]);
    }

    window.firstStage.cards = greenCards.splice(0, window.activeAncient.firstStage.greenCards);
    window.firstStage.cards = window.firstStage.cards.concat(brownCards.splice(0, window.activeAncient.firstStage.brownCards));
    window.firstStage.cards = window.firstStage.cards.concat(blueCards.splice(0, window.activeAncient.firstStage.blueCards));

    window.secondStage.cards = greenCards.splice(0, window.activeAncient.secondStage.greenCards);
    window.secondStage.cards = window.secondStage.cards.concat(brownCards.splice(0, window.activeAncient.secondStage.brownCards));
    window.secondStage.cards = window.secondStage.cards.concat(blueCards.splice(0, window.activeAncient.secondStage.blueCards));

    window.thirdStage.cards = greenCards;
    window.thirdStage.cards = window.thirdStage.cards.concat(brownCards, blueCards);

    currentState.appendChild(createStage("firstStage"));
    currentState.appendChild(createStage("secondStage"));
    currentState.appendChild(createStage("thirdStage"));
    deckContainer.appendChild(currentState);

    const deck = document.createElement("div");
    deck.classList.add("deck");
    deck.style.backgroundImage = `url('./assets/mythicCardBackground.png')`;
    deck.addEventListener('click', clickDeck); 
    deckContainer.appendChild(deck);

    const last = document.createElement("div");
    last.classList.add("last-card");
    deckContainer.appendChild(last);
}

function clickAncient(event) {
    Array.from(document.getElementsByClassName('ancient-card')).forEach(e => e.classList.remove("active"));
    event.target.classList.add("active");
    window.activeAncient = getActiveAncientCard(event.target.id);
    initDifficulties();
}

function clickDifficulty(event) {
    Array.from(document.getElementsByClassName('difficulty')).forEach(e => e.classList.remove("active")); 
    event.target.classList.add("active");
    window.difficulty = event.target.id;
    initButtonDeckShuffle();
}

function clickDeck(event) {
    let card = null;
    let currentDot = null;
    if(window.firstStage.cards.length > 0) {
        card = getCardFromStage("firstStage");
        currentDot = document.querySelector(".current-state").getElementsByClassName("stage-container")[0].querySelector(`.dot.${card.color}`);

        if(window.firstStage.cards.length == 0) {
            document.querySelector(".current-state").getElementsByClassName("stage-container")[0].querySelector(".stage-text").classList.add("done");
        }
    } else if(window.secondStage.cards.length > 0) {
        card = getCardFromStage("secondStage");
        currentDot = document.querySelector(".current-state").getElementsByClassName("stage-container")[1].querySelector(`.dot.${card.color}`);

        if(window.secondStage.cards.length == 0) {
            document.querySelector(".current-state").getElementsByClassName("stage-container")[1].querySelector(".stage-text").classList.add("done");
        }
    } else if(window.thirdStage.cards.length > 0) {
        card = getCardFromStage("thirdStage");
        currentDot = document.querySelector(".current-state").getElementsByClassName("stage-container")[2].querySelector(`.dot.${card.color}`);

        if(window.thirdStage.cards.length == 0) {
            document.querySelector(".current-state").getElementsByClassName("stage-container")[2].querySelector(".stage-text").classList.add("done");
            event.target.style.backgroundImage = '';
        }
    } else {
        event.target.style.backgroundImage = '';
        return;
    }

    currentDot.textContent = (+currentDot.textContent) - 1;
    document.querySelector(".last-card").style.backgroundImage = `url('${card.cardFace}')`;
}

function getActiveAncientCard(id) {
    return Object.values(AncientsData).find(e => e.id == id);
}

function createStage(stage) {
    const stageContainer = document.createElement("div");
    stageContainer.classList.add("stage-container");

    const titleStageContainer = document.createElement("span");
    titleStageContainer.classList.add("stage-text");
    titleStageContainer.textContent = window[stage].name;
    stageContainer.appendChild(titleStageContainer);

    const dotsContainer = document.createElement("div");
    dotsContainer.classList.add("dots-container");

    const dotGreen = document.createElement("div");
    dotGreen.classList.add("dot", "green");
    dotGreen.textContent = window.activeAncient[stage].greenCards;
    dotsContainer.appendChild(dotGreen);

    const dotBrown = document.createElement("div");
    dotBrown.classList.add("dot", "brown");
    dotBrown.textContent = window.activeAncient[stage].brownCards;
    dotsContainer.appendChild(dotBrown);

    const dotBlue = document.createElement("div");
    dotBlue.classList.add("dot", "blue");
    dotBlue.textContent = window.activeAncient[stage].blueCards;
    dotsContainer.appendChild(dotBlue);

    stageContainer.appendChild(dotsContainer);

    return stageContainer;
}

function getCardFromStage(stage) {
    const indexCard = Math.floor(Math.random() * window[stage].cards.length);
    const card = window[stage].cards[indexCard];
    return window[stage].cards.splice(indexCard, 1)[0];
}

function filterCards(cards, color) {
    if(window.difficulty !== "normal") {
        const countCards = window.activeAncient.firstStage[color] + window.activeAncient.secondStage[color] + window.activeAncient.thirdStage[color];
        if(window.difficulty == 'very_easy') {
            let filterCards = [];
            filterCards = cards.filter(e => e.difficulty == "easy");
            
            if(filterCards.length < countCards) {
                cards.forEach(e => {
                    if(filterCards.length < countCards && e.difficulty == "normal") {
                        filterCards.push(e);
                    }
                });
            }

            return filterCards;
        } else if(window.difficulty == 'very_hard') {
            let filterCards = [];
            filterCards = cards.filter(e => e.difficulty == "hard");

            if(filterCards.length < countCards) {
                cards.forEach(e => {
                    if(filterCards.length < countCards && e.difficulty == "normal") {
                        filterCards.push(e);
                    }
                });
            }

            return filterCards;
        }

        return cards.filter(e => e.difficulty == window.difficulty || e.difficulty == "normal")
    }
    return cards;
}

function clear(stage) {
    switch(stage) {
        case 1:
            document.querySelector('.difficulty-container').innerHTML = '';
        case 2:
            document.querySelector('.deck-container').innerHTML = '';
    }
}