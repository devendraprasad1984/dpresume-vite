export default function getFromAPI(uri, success, error) {
    const errMsg = msg => 'something went wrong - ' + msg;
    const header = {
        "Content-Type": 'application/json',
        "Accept": 'application/json'
    }
    try {
        // console.log('fetching', uri)
        fetch(uri, header).then(res => res.json()).then(data => success(data)).catch(err => alert(errMsg(err)));
    } catch (err) {
        alert(errMsg(err));
    }
}
