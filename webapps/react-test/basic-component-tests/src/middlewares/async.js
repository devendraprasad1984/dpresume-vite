// export default function asyncMiddleware({dispatch}){
//     return function(next){
//         return function(action){
//
//         }
//     }
// }

const asyncMiddleware = ({dispatch}) => (next) => (action) => {
    //check to see if the action as promise on payload property, if it does, wait for it to resolve, else move to next middleware in chain
    if (!action.payload || !action.payload.then) {
        return next(action)
    }

    //if it has a promise, we want to wait for it to resolve or get data and create a new action with it and dispatch it
    action.payload.then((res) => {
        // const newAction = {...action, payload: res}
        const newAction = Object.assign({}, action, {payload: res})
        dispatch(newAction)
    })
}
export default asyncMiddleware