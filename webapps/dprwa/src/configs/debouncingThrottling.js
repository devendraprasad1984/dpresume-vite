// as long as it continues to be invoked, it will not be triggered
export const debouncing = (callback, interval = 2000) => {
  let timeoutRef
  return (...args) => {
    let context = this
    clearTimeout(timeoutRef)
    timeoutRef = setTimeout((...args) => {
      timeoutRef = null
      callback.apply(context, args)
    }, interval)
  }
}

// as long as it continues to be invoked, raise on every interval
export const throttling = (callback, interval = 2000) => {
  let timeout = false
  return (...args) => {
    let context = this
    if (!timeout) {
      callback.apply(context, args)
      setTimeout((...args) => {
        timeout = false
      }, interval)
    }
  }
}