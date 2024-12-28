const keys = {
    SET_FILTER: 'SET_FILTER',
    GET_FILTER: 'GET_FILTER',
    GET_FILTER_OBJECTS: 'GET_FILTER_OBJECTS',
    TOGGLE_LEFT_PANE: 'TOGGLE_LEFT_PANE',
}

export default function Types() {
    return {
        keys,
        setFilterToStore: (payload) => {
            return {
                type: keys.SET_FILTER
                , payload
            }
        }, toggleLeftPanel: (payload) => {
            return {
                type: keys.TOGGLE_LEFT_PANE
                ,payload
            }
        }

    }
}