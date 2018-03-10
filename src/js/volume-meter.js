const effectMicrophone = document.querySelector('.microphone-volume');

var volumeMeter = {
    capturedValues: [],
    actualRound: 0,
    average: 0,

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

        // That value is user to calculate the average
        let volumeInt = Math.round(this.volume * 100);

        if(volumeMeter.actualRound < 1000) {
            volumeMeter.capturedValues[volumeMeter.actualRound] = volumeInt;
            volumeMeter.actualRound++;
            let sum = volumeMeter.capturedValues.reduce((a, b) => a + b);
            volumeMeter.average = sum / volumeMeter.actualRound;

            return;
        }

        volumeMeter.updateEffectMicrophone(volumeInt);
    },

    calculateAverage: function() {

    },

    updateEffectMicrophone: function(volume) {
        volume = Math.round(260 + volume * 2.5);

        effectMicrophone.style.width = volume + "px";
        effectMicrophone.style.height = volume + "px";

        if(volume > 350) {
            // console.log('Áudio máximo alcançado...');
            document.querySelector('.content').style.background = '#c0392b';
        } else {
            document.querySelector('.content').style.background = '#002f58';
        }

        console.log(volume);
    }
}
