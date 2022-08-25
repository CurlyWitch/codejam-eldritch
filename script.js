import AncientsData from '/data/ancients.js'

function init() {
    initAncient();
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
