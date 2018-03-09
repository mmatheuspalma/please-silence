var audioContext = null;
var meter = null;
var rafID = null;

window.onload = () => {
    // grab microphone to turn on

    var $microphoneSwitcher = document.getElementById('microphone-switcher');

    $microphoneSwitcher.addEventListener('click', (event) => {
        // monkeypatch Web Audio
        window.AudioContext = window.AudioContext || window.webkitAudioContext;

        // grab an audio context
        audioContext = new AudioContext();

        // Attempt to get audio input
        try {
            // monkeypatch getUserMedia
            navigator.getUserMedia =
                navigator.getUserMedia ||
                navigator.webkitGetUserMedia ||
                navigator.mozGetUserMedia;

            // ask for an audio input
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
    alert('Stream generation failed.');
}

function gotStream(stream) {
    // Create an AudioNode from the stream.
    mediaStreamSource = audioContext.createMediaStreamSource(stream);

    // Create a new volume meter and connect it.
    meter = volumeMeter.createAudioMeter(audioContext);
    mediaStreamSource.connect(meter);
}
