import React, {useState} from 'react'


function CounterBatchingCheck(props) {
    const [counter1, setCounter1] = useState(0)
    const [counter2, setCounter2] = useState(0)


    const singleBatchedUpdate = () => {
        setCounter1(x => x + 1)
        setCounter1(x => x + 1)
    }
    const twoUpdatesNotBatchedAsyncCall = () => {
        setTimeout(() => {
            setCounter2(x => x + 1)
            setCounter2(x => x + 1)
        }, 1000)
    }

    return <>
        <div style={{margin:'10px'}}>
            <div>Counter Batching check React17 and older</div>
            <div>
                <button onClick={singleBatchedUpdate}>Increment in synchrounous code - single update for 2 state changes</button>
            </div>
            <div>
                <button onClick={twoUpdatesNotBatchedAsyncCall}>timeout Increment in asynchrounous code - 2 update for 2 state changes</button>
            </div>
            <div>
                <h2>Counter1: Batched: {counter1}</h2>
                <h2>Counter1: Not Batched: {counter2}</h2>
            </div>
        </div>
    </>
}

export default CounterBatchingCheck
