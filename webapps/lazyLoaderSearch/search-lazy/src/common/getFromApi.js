export default function getData(url, callback) {
    let headers = {
        method: 'GET'
    }
    fetch(url, headers)
        .then(res => res.json())
        .then(data => callback(data))
        .catch(err => callback({error: err}))
}
