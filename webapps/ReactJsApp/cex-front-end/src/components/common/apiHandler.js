
export const get = (uri, success, error) => {
    const errMsg = msg => {
        if (error !== undefined) error(msg)
        console.log('something went wrong - ' + msg)
    };
    const header = {
        "Content-Type": 'application/json',
        "Accept": 'application/json'
    }
    try {
        fetch(uri, header).then(res => res.json()).then(data => success(data)).catch(err => errMsg(err));
    } catch (err) {
        errMsg(err);
    }
}


export const download = (uri) => {
    const header = {
        "Content-Type": 'application/octet-stream',
    }
    try {
        fetch(uri, header).then(res => res.blob()).then(blob => {
            const url = window.URL.createObjectURL(
                new Blob([blob]),
            );
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute(
                'download',
                `FileName.pdf`,
            );
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
        });
    } catch (err) {
        console.log(err)
    }
}


export const post = (uri, payload, success) => {
    let headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    };
    let data2send = {
        method: 'POST'
        , headers: headers
        , body: JSON.stringify(payload)
    };
    try {
        fetch(uri, data2send)
            .then(res => res.json())
            .then(data => success(data))
            .catch(err => console.log(err));
    } catch (err) {
        console.log(err)
    }
}


export const sendFiles = (uri, payload, callback) => {
    const formData = new FormData();
    // formData.append('files[]', payload)
    // formData.append('file', {uri: '', name: payload.name, type: payload.type})
    formData.append('enctype', 'multipart/form-data')
    formData.append('content-type', 'application/octet-stream')
    formData.append('file', payload)
    fetch(uri, {
        method: 'post',
        headers: {
            'Accept': "application/x-www-form-urlencoded"
        },
        body: formData
    })
        .then((res) => res.json())
        .then((data) => {
            callback(data.status)
        })
        .catch((error) => {
            callback(error);
        });
}


