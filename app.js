// Matthew Kleitz, 2019
const START = 0;
const MAIN = 1;
var state = START;

function setup() {
    createCanvas(windowWidth, windowHeight);
}

function draw() {
    if (state == START) {
        drawStart();
    } else if (state == MAIN) {
        drawMain();
    }
}

function drawStart() {
    background(200, 100, 75);
    fill(0);
    textSize(24);
    text("Tap to begin.", 100, height/2);

}

// color fillings for the blocks
const nDc = [150, 200, 155]; // nine default color
const oDc = [255, 100, 155]; // one default color
const nPc = [100, 160, 105]; // nine pressed color
const oPc = [205, 70, 125]; // one pressed color
let nineFill = nDc;
let oneFill = oDc;

let nineDown = false;
let oneDown = false;

function touchStarted() {
    anyPressed = true;
    if (state == START) { state = MAIN; }
    else {
        
        if (mouseY < height/2) {
            nineFill = nPc;
            nineDown = true;
        } else {
            oneFill = oPc;
            oneDown = true;
        }
    }

    return false;
}

function touchEnded() {
    if (nineDown || oneDown) {
        stopSound();
    }
    nineFill = nDc;
    oneFill = oDc;
    nineDown = oneDown = false;
    
    return false;
}
var anyPressed = false;

function drawMain() {
    textSize(72);
    background(0);
    // draw the nine
    fill(nineFill[0], nineFill[1], nineFill[2]);
    rect(0, 0, width, height/2);
    fill(0);
    text("9", width/2, height/4);

    // draw the one
    fill(oneFill[0], oneFill[1], oneFill[2]);
    rect(0, height/2, width, height/2);
    fill(0);
    text("1", width/2, height * 0.75);

    if (nineDown) {
        var amp = 1 - mouseY/(height/2);
        amp = (amp > 1 ? 1 : amp);
        amp = (amp < 0 ? 0.01 : amp);
        startSound("nine", amp);
        setGain(amp);
    } else if (oneDown) {
        var amp = 1 - (mouseY - height/2)/(height/2);
        amp = (amp > 1 ? 1 : amp);
        amp = (amp < 0 ? 0.01 : amp);
        startSound("one", amp);
        setGain(amp);
    } else if (anyPressed) {
        stopSound();
    }
}