const $elementMicrophoneEffect = document.querySelector(".microphone-volume");
const $elementSound = document.querySelector("#alarm-element");
const $elementContent = document.querySelector("#content");

var volumeMeter = {
    effectMicrophone: 0,
    mediumSound: 100,
    sizeElementMicrophone: document.getElementById("microphone-switcher").offsetWidth + 5,

    createAudioMeter: function(audioContext, clipLevel, averaging, clipLag) {
        var processor = audioContext.createScriptProcessor(512);
        processor.onaudioprocess = volumeMeter.volumeAudioProcess;
        processor.clipping = false;
        processor.lastClip = 0;
        processor.volume = 0;
        processor.clipLevel = clipLevel || 0.98;
        processor.averaging = averaging || 0.95;
        processor.clipLag = clipLag || 750;

        processor.connect(audioContext.destination);

        processor.shutdown = function() {
            this.disconnect();
            this.onaudioprocess = null;
        };

        return processor;
    },

    volumeAudioProcess: function(event) {
        var buf = event.inputBuffer.getChannelData(0);
        var bufLength = buf.length;
        var sum = 0;
        var x;

        for (var i = 0; i < bufLength; i++) {
            x = buf[i];

            if (Math.abs(x) >= this.clipLevel) {
                this.clipping = true;
                this.lastClip = window.performance.now();
            }

            sum += x * x;
        }

        var rms =  Math.sqrt(sum / bufLength);
        this.volume = Math.max(rms, this.volume * this.averaging);

        let volumeInt = Math.round(this.volume * 200);
        volumeMeter.updateEffectMicrophone(volumeInt);
    },

    updateEffectMicrophone: function(volume) {
        volume = volume || 0;
        volumeMeter.effectMicrophone = Math.round(volumeMeter.sizeElementMicrophone + volume);

        $elementMicrophoneEffect.style.width = volumeMeter.effectMicrophone + "px";
        $elementMicrophoneEffect.style.height = volumeMeter.effectMicrophone + "px";

        if(volume > volumeMeter.mediumSound) {
            // TODO: alerta, obter média

            console.log('Barulho em excesso, alerta disparado.');

            $elementSound.volume = 1;
            $elementSound.play();

            $elementContent.style.background = "#c0392b";
        } else {
            $elementContent.style.background = "#002f58";
        }
    }
}
