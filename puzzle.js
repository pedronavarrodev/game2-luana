
var rows = 3;
var columns = 3;

var currTile;
var otherTile; // em branco

var turns = 0;

// testar
// var imgOrder = ["1", "2", "3", "4", "5", "6", "7", "8", "9"]; // 100%
var imgOrder = ["1", "3", "2", "4", "5", "6", "7", "8", "9"]; // teste
// var imgOrder = ["4", "2", "8", "5", "1", "6", "7", "9", "3"]; // array de testes

// Embaralhar
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // Troca os elementos
    }
}

// Cria o array e embaralha
var imgOrder = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
// shuffleArray(imgOrder);


window.onload = function() {
    
    shuffleArray(imgOrder); // Embaralha o array cada vez que a página é carregada

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            let tile = document.createElement("img");
            tile.id = r.toString() + "-" + c.toString();
            tile.src = imgOrder.shift() + ".png"; // Usa o array embaralhado

            //DRAG FUNCTIONALITY
            tile.addEventListener("dragstart", dragStart);  //clica na imagem p mover
            tile.addEventListener("dragover", dragOver);    //move a imagem ao redor do que foi clicado
            tile.addEventListener("dragenter", dragEnter);  //move a imagem para o outro
            tile.addEventListener("dragleave", dragLeave);  //move a imagem e tira o outro
            tile.addEventListener("drop", dragDrop);        //coloca a imagem acima da outra, tira a img
            tile.addEventListener("dragend", dragEnd);      //depois de pegar e tirar, Finaliza

            document.getElementById("board").append(tile);

        }
    }
}

function isAdjacentToEmptySpace(tile) {
    let coords = tile.id.split("-");
    let r = parseInt(coords[0]);
    let c = parseInt(coords[1]);

    let emptySpaceCoords = document.getElementById(emptySpaceId).id.split("-");
    let emptyR = parseInt(emptySpaceCoords[0]);
    let emptyC = parseInt(emptySpaceCoords[1]);

    return Math.abs(r - emptyR) + Math.abs(c - emptyC) === 1;
}

// função para endgame
function checkComplete() {
    var correctOrder = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
    var currentOrder = [];
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            let tileImg = document.getElementById(r.toString() + "-" + c.toString()).src;
            let tileNumber = tileImg.charAt(tileImg.length - 5);
            currentOrder.push(tileNumber);
        }
    }

    if (currentOrder.join('') === correctOrder.join('')) {
        if (turns > 110) {
            alert("Parabéns! Você completou o quebra-cabeça 🎉! mas levou mais de 110 turnos e não pode ver a mensagem secreta, para tentar de novo, atualize a página");
            location.reload();
        } else {
            if (confirm("Incrível! Você completou o quebra-cabeça em menos de 110 turnos! Clique em OK para ir até a página secreta 🥰")) {
                setTimeout(function() {
                    window.location.href = "https://pedronavarrodev.github.io/endgame-lua/";
                }, 2000); // Atraso de 3 segundos
            }
        }
    }
}

function dragStart() {
    currTile = this; //this refers to the img tile being dragged
}

function dragOver(e) {
    e.preventDefault();
}

function dragEnter(e) {
    e.preventDefault();
}

function dragLeave() {

}

function dragDrop() {
    otherTile = this; //refere a img dropada
}



function checkAdjacency(coords1, coords2) {
    let r1 = parseInt(coords1[0]);
    let c1 = parseInt(coords1[1]);
    let r2 = parseInt(coords2[0]);
    let c2 = parseInt(coords2[1]);

    return r1 === r2 && Math.abs(c1 - c2) === 1 || c1 === c2 && Math.abs(r1 - r2) === 1;
}

function isEmptySpace(tile) {
    return tile.src.includes("3.png");
}

function swapTiles(tile1, tile2) {
    let tempSrc = tile1.src;
    tile1.src = tile2.src;
    tile2.src = tempSrc;
}

function dragEnd() {
    if (!otherTile) return;

    let currCoords = currTile.id.split("-");
    let otherCoords = otherTile.id.split("-");

    let isAdjacent = checkAdjacency(currCoords, otherCoords);

    if (isAdjacent && isEmptySpace(otherTile)) {
        swapTiles(currTile, otherTile);
        turns++;
        document.getElementById("turns").innerText = turns;

        performClickAction(currTile, otherTile); // som função

        checkComplete();
    }

    otherTile = null; // Reset otherTile after the swap
}

// som ao mover

var moveSound = new Audio('./click.mp3'); // caminho do audio
moveSound.volume = 0.1; // Ajustar o volume aqui, 0.5 é 50% do volume máximo

function performClickAction(tile1, tile2) {
    if (!moveSound.paused) {
        moveSound.pause();
        moveSound.currentTime = 0; // Reinicia o som
    }
    moveSound.play();
}

