import AncientsData from '/data/ancients.js'
import Difficulties from '/data/difficulties.js'

function init() {
    initAncient();
    Array.from(document.getElementsByClassName('ancient-card')).forEach(e => e.addEventListener('click', clickAncient));
}

init();

function initAncient() {
    Object.values(AncientsData).forEach(e => {
        const div = document.createElement("div");
        div.classList.add("ancient-card");
        div.style.backgroundImage = `url('${e.cardFace}')`;
        document.querySelector('.ancients-container').appendChild(div);
    })
}

function initDifficulties() {
    document.querySelector('.difficulty-container').innerHTML = '';
    Object.values(Difficulties).forEach(e => {
        const div =  document.createElement("div");
        div.classList.add("difficulty");
        div.id = e.id;
        div.textContent = e.name;  
        document.querySelector('.difficulty-container').appendChild(div);
    })
}


function clickAncient(event) {
    Array.from(document.getElementsByClassName('ancient-card')).forEach(e => e.classList.remove("active"));
    event.target.classList.add("active");
    initDifficulties();
}