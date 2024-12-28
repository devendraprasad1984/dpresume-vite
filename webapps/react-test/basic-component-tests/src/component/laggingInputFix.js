import React, {useCallback, useState} from 'react'

const Input=({setValue})=>{
    //heavyCalc, useMemo here
    return <input onChange={(e)=>setValue(e.target.value)}/>
}

export default function LaggingInput(){
    const [name, setName]=useState('')
    const nameHandler= useCallback((value)=>setName(v=>value),[])
    return <div>
        <h1>test name input lagging handler fix - NO LAG</h1>
        <div>
            <h3>you name is {name}</h3>
            <Input setValue={nameHandler}/>
        </div>
    </div>
}