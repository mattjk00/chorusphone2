var audioCtx = new (window.AudioContext || window.webKitAudioContext)();

function generateWaveTable(freq, numSamples) {
    let wtSize = 1024;
    let phaseIncrement = (freq * wtSize) / audioCtx.sampleRate;
    let wt = new Array(wtSize);
    let phase = 0.0;
    for (var i = 0; i < wtSize; i++) {
        var insertion = Math.sin(2.0 * Math.PI * i / wtSize);
        wt[i] = insertion;
    }

    // fill an output buffer with the wave
    let oBuffer = new Array(numSamples);
    for (var i = 0; i < numSamples; i++) {
        var sample = wt[Math.floor(phase)];
        phase = (phase + phaseIncrement) % wtSize;
        oBuffer[i] = sample;
    }
    
    return oBuffer;
}

var buffer = audioCtx.createBuffer(1, audioCtx.sampleRate, audioCtx.sampleRate);
const lnNine = generateWaveTable(852, audioCtx.sampleRate);
const hnNine = generateWaveTable(1477, audioCtx.sampleRate);
const lnOne = generateWaveTable(697, audioCtx.sampleRate);
const hnOne = generateWaveTable(1209, audioCtx.sampleRate);

let soundFinished = true;

var source = audioCtx.createBufferSource();

let gain = audioCtx.createGain();
gain.connect(audioCtx.destination);

function startSound(num, amp) {
    var channel = buffer.getChannelData(0);
    //let wave = generateWaveTable(1000, audioCtx.sampleRate);
    if (soundFinished) {
        soundFinished = false;

        for (var i = 0; i < lnNine.length; i++) {
            //channel[i] = lnNine[i] + hnNine[i] * 0.25;
            if (num === "nine") {
                channel[i] = (lnNine[i] + hnOne[i]) * 0.25;
            } else {
                channel[i] = (lnOne[i] + hnOne[i]) * 0.25;
            }
            
        }
        source = audioCtx.createBufferSource();
        source.buffer = buffer;
        source.loop = true;
        //source.connect(audioCtx.destination);
        gain.gain.setValueAtTime(amp, audioCtx.currentTime);
        source.connect(gain);
        source.start();

        source.onended = () => {
            console.log("Sound finished.");
            soundFinished = true;
        }
    }
}

function stopSound() {
    if (soundFinished == false) {
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.01);
        if (gain.gain.value <= 0.01) {
            source.stop();
        }
        //source.stop();
    }
    //gain.gain.value = gain.gain.value - 0.1;
    
}

function setGain(g) {
    gain.gain.exponentialRampToValueAtTime(g, audioCtx.currentTime + 0.01);
}