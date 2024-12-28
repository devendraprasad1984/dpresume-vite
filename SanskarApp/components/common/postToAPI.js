export default function postToAPI(uri, payload, success) {
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
