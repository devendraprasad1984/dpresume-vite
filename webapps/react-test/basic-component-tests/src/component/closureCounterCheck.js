import React, {useState} from 'react'

const ClosureCounterCheck = () => {
    const [counter, setCounter] = useState(0)
    const handleClick = () => {
        // console.log('counter', counter)
        let fn = (ival) => {
            console.log('counter', counter)
            setCounter(ival + 1)
        }
        // setCounter(counter+1)
        setTimeout(fn(counter), 3000)
    }
    return <div>
        <h1>basic settimeout/closure counter test</h1>
        <span>Counter Check {counter}</span><br/>
        <button onClick={handleClick}>click me</button>
    </div>
}
export default ClosureCounterCheck
