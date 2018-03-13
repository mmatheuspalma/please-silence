var audioContext = null;
var meter = null;
var mediaStreamSource = null;
const $microphoneSwitcher = document.getElementById("microphone-switcher");

window.onload = () => {
    $microphoneSwitcher.addEventListener("click", (event) => {
        audioContext = new AudioContext();

        try {
            navigator.getUserMedia =
                navigator.getUserMedia ||
                navigator.webkitGetUserMedia ||
                navigator.mozGetUserMedia;

            navigator.getUserMedia({
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
    console.log('Permissão bloqueada para o microfone.');

    meter.shutdown();

    if ( $microphoneSwitcher.classList.contains("-active") ) {
        $microphoneSwitcher.classList.remove("-active");
    }

    var $effectMicrophone = document.querySelector(".microphone-volume");
    $effectMicrophone.style.width = 0 + "px";
    $effectMicrophone.style.height = 0 + "px";
    document.querySelector(".content").style.background = "#002f58";
}

function gotStream(stream) {
    console.log('Permissão concedida para o microfone.');

    mediaStreamSource = audioContext.createMediaStreamSource(stream);

    meter = volumeMeter.createAudioMeter(audioContext);
    mediaStreamSource.connect(meter);

    $microphoneSwitcher.classList.add("-active");
}
