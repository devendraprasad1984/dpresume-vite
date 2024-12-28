export default function debounce(func, wait) {
    let timer
    return function () {
        const context = this
        clearTimeout(timer)
        timer = setTimeout(() => func.apply(context, arguments), wait)
    }
}
