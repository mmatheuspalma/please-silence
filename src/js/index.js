var audioContext = null;
var meter = null;
var rafID = null;
const $microphoneSwitcher = document.getElementById('microphone-switcher');

window.onload = () => {

    $microphoneSwitcher.addEventListener('click', (event) => {

        window.AudioContext = window.AudioContext || window.webkitAudioContext;

        audioContext = new AudioContext();

        try {

            navigator.getUserMedia =
                navigator.getUserMedia ||
                navigator.webkitGetUserMedia ||
                navigator.mozGetUserMedia;

            navigator.getUserMedia(
            {
                "audio": {
                    "mandatory": {
                        "googEchoCancellation": "true",
                        "googAutoGainControl": "false",
                        "googNoiseSuppression": "true",
                        "googHighpassFilter": "false"
                    },
                    "optional": []
                },

            }, gotStream, didntGetStream);

        } catch (e) {
            alert('getUserMedia threw exception :' + e);
        }
    });
}

function didntGetStream() {
    alert('Aceite a permissão para a aplicação funcionar corretamente :D');

    var microphoneActive = document.querySelectorAll('[class*=-active]');

    for ( i = 0; i < microphoneActive.length; i++ ) {
        microphoneActive[i].classList.remove('-active');
    }
}

function gotStream(stream) {
    mediaStreamSource = audioContext.createMediaStreamSource(stream);

    meter = volumeMeter.createAudioMeter(audioContext);
    mediaStreamSource.connect(meter);

    $microphoneSwitcher.classList.add('-active');
}
