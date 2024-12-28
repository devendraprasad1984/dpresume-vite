const keys = {
    SET_AGENT: 'SET_AGENT',
}

export default function Types() {
    return {
        keys,
        setAgentToStore: (data) => {
            return {
                type: keys.SET_AGENT
                , data: data
            }
        }
    }
}
