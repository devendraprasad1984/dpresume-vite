import React, {useState} from 'react'

const InputTag = props => {
    const {defaultTags, getValues} = props
    const [tags, setTags] = useState([...defaultTags])
    const [textVal, setTextVal] = useState('')

    const tagsCallback = (vals) => getValues !== undefined ? getValues(vals) : null
    const handleEntry = e => {
        if (e.keyCode === 13) {
            let val = e.target.value
            let updatedTags = [...tags, val]
            setTags(updatedTags)
            setTextVal('')
            tagsCallback(updatedTags)
        }
    }
    const handleRemoveItem = (tagIndex, item) => {
        // console.log(tagIndex, item)
        let newTags = tags.filter((x, i) => i !== tagIndex)
        setTags([...newTags])
        tagsCallback(newTags)
    }
    const displayTags = () => {
        return tags.map((x, i) => {
            return <span className='tag' key={'tag' + i}>{x}
                <a href='#' className='close' onClick={() => handleRemoveItem(i, x)}>x</a>
            </span>
        })
    }
    const handleResetTags=()=>{
        setTags([])
    }
    return <div>
        <div className='tags'>{displayTags()}</div>
        <input value={textVal} onChange={e => setTextVal(e.target.value)} type="text" onKeyDown={handleEntry}/>
        <button onClick={handleResetTags}>reset</button>
    </div>
}

export default InputTag
