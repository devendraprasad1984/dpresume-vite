const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
const mic = new SpeechRecognition()

mic.continuous = true
mic.interimResults = true
mic.lang = 'en-US'

voicey = {
    listen: false,
    notes: ''
}
const init=()=> {
    navigator.mediaDevices.getUserMedia({audio: true})
        .then(function (stream) {
            console.log('You let me use your mic!')
        })
        .catch(function (err) {
            console.log('No mic for you!')
        });
};
init();

const handleListen = (cur) => {
    // console.log(cur.innerHTML);
    cur.innerHTML = cur.innerHTML.toLowerCase() === 'start' ? 'Stop' : 'Start';
    voicey.listen = !voicey.listen;
    if (voicey.listen) {
        mic.start()
        mic.onend = () => mic.start()
    } else {
        mic.stop()
        mic.onend = () => {
        }
    }
    mic.onstart = () => {
    }

    mic.onresult = event => {
        const transcript = Array.from(event.results)
            .map(result => result[0])
            .map(result => result.transcript)
            .join('')
        // console.log(transcript)
        voicey.notes = transcript;
        notes.innerHTML = voicey.notes;
        mic.onerror = event => {
            console.log(event.error)
        }
    }
}

