let _dispatch = undefined
let increment = document.getElementById('increment')
let decrement = document.getElementById('decrement')
let helloBtn = document.getElementById('hello')
let value = document.getElementById('value')


const hello = (state = 'wow', action) => {
    switch (action.type) {
        case 'HOLA':
            state = state === 'wow' ? 'value changed to hello' : 'wow'
            return state
        default:
            return state
    }
}
const counter = (state = 0, action) => {
    switch (action.type) {
        case 'PLUS':
            state = state + 1
            return state
        case 'MINUS':
            state = state - 1
            return state
        default:
            return state
    }
}


const handleActions = () => {
    increment.addEventListener('click', function (e) {
        _dispatch({type: 'PLUS'})
    })
    decrement.addEventListener('click', function (e) {
        _dispatch({type: 'MINUS'})
    })
    helloBtn.addEventListener('click', function (e) {
        _dispatch({type: 'HOLA'})
    })
}
const sayHiOnDispatch = () => {
    return console.log('hi dispatching actions')
}

//init app context
(function () {
    const {createStore, compose, combineReducers} = Redux
    let initStore = {}
    let rootReducer = combineReducers({
        hello,
        counter
    })
    let enhancersMiddlewares = compose({
        sayHiOnDispatch
    })
    let store = createStore(rootReducer, initStore)
    let {dispatch, getState, subscribe} = store
    _dispatch = dispatch
    handleActions()

    const render = () => {
        value.innerHTML = getState().counter
    }
    const renderHello = () => {
        value.innerHTML +="<br/>"+ getState().hello
    }
    let unsubscribe = subscribe(() => {
        console.log('cur state', getState())
        render()
        renderHello()
    })
})()
