export const GET_API_HOOK = async (url) => {
    const header = {}
    try {
        // fetch(url, {headers: header}).then(r => r.json()).then(data => callback(data)).catch(err => callback({error: err}))
        let res = await fetch(url, {headers: header})
        let data = await res.json()
        return data
    } catch (err) {
        return {error: err}
    }
}
