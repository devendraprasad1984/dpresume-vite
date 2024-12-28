const timer = document.getElementById('timer');
const timerCounterEndBy = 'timerCounterEndBy'
const timerCur = 'timerCurVal'
let counterInitVal = 60
let tref = undefined

const setLocal = (key, val) => {
    localStorage.setItem(key, val)
}

const clearLocal = (key) => {
    localStorage.removeItem(key)
}
const getLocal = (key) => {
    let curVal = localStorage.getItem(key)
    return curVal
}

const gettime = () => {
    let now = new Date()
    // let val = now.getUTCHours() + now.getUTCMinutes() + now.getUTCSeconds()
    let val = Math.round(new Date().getTime() / 1000)
    return val
}

const setTimer = () => {
    tref = setInterval(() => {
        let cur = gettime()
        let end = getLocal(timerCounterEndBy)
        setLocal(timerCur, cur)
        if (cur > end || (end - cur > counterInitVal)) {
            stop()
            return
        }
        timer.innerHTML = end - cur
    }, 1000)
}

const start = () => {
    stop()
    init()
}


const stop = () => {
    clearLocal(timerCounterEndBy)
    clearLocal(timerCur)
    clearInterval(tref)
    timer.innerHTML = 'stopped'
}

const init = () => {
    let curCacheTimer = getLocal(timerCounterEndBy)
    if (curCacheTimer === undefined || curCacheTimer === null) {
        let now = gettime()
        setLocal(timerCounterEndBy, (now + counterInitVal))
        // setLocal('end', now1+counterInitVal)
        // setLocal('start', now1)
        setLocal(timerCur, now)
        timer.innerHTML = 'Starting in a sec'
    }
    setTimer()
}

(function () {
    init()
})()


