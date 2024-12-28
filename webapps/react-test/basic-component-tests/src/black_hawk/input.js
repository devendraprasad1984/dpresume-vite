import React from 'react'

const Input = props => {
    const {change} = props

    const handleChange=e=>{
        if(change===undefined) return
        let val=e.target.value
        change(val)
    }
    return <div>
        <input onChange={handleChange}/>
    </div>
}

export default Input
