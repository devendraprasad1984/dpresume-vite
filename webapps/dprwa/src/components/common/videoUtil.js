export function clearphoto(canvas,photo) {
    let context = canvas.getContext('2d');
    context.fillStyle = "#AAA";
    context.fillRect(0, 0, canvas.width, canvas.height);

    let data = canvas.toDataURL('image/png');
    photo.setAttribute('src', data);
}

export function takepicture(canvas,photo) {
    let context = canvas.getContext('2d');
    if (width !== 0 && height !== 0) {
        canvas.width = width;
        canvas.height = height;
        context.drawImage(video, 0, 0, width, height);

        let data = canvas.toDataURL('image/png');
        console.log('canvas', canvas, 'video', video, 'photo', photo, data)
        photo.setAttribute('src', data);
    } else {
        clearphoto();
    }
}

export function startup(canvas,photo,video,callback) {
    navigator.mediaDevices.getUserMedia({video: true, audio: false})
        .then(function (stream) {
            video.srcObject = stream;
            video.play();
            callback(stream)
        })
        .catch(function (err) {
            console.log("An error occurred: " + err);
        });
    video.addEventListener('canplay', function (ev) {
        if (!streaming) {
            let height = video.videoHeight / (video.videoWidth / width);
            video.setAttribute('width', width);
            video.setAttribute('height', height);
            canvas.setAttribute('width', width);
            canvas.setAttribute('height', height);
            let streaming = true;
        }
    }, false);
    // clearphoto();
}
