import ENUMS from "../enums";

const initCounter = 0
const TestUpDown = (counterState = initCounter, action) => {
    switch (action.type) {
        case ENUMS.INCREMENT:
            return counterState + 1
        case ENUMS.DECREMENT:
            return counterState - 1
        default:
            return counterState
    }
}
export default TestUpDown
