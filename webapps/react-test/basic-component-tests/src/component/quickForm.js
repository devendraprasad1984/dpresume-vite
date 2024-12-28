import React,{useRef, useState} from 'react'

const labels={
    text1:'text1',
    text2: 'text2',
    text3: 'text3'
}

const defaultFormVal = {
    [labels.text1]: '',
    [labels.text2]: '',
    [labels.text3]: ''
}

const QuickForm=props=>{
    const form1=useRef()
    const [meta, setMeta]=useState({...defaultFormVal})

    const handleChange=e=>{
        let val=e.target.value
        let name = e.target.name
        let tmp={}
        tmp[name]=val
        setMeta({...meta, ...tmp})
    }

    const handleSubmit=(e)=>{
        console.log('submit',{...meta})
        e.preventDefault()
    }

    const handleReset=e=>{
        setMeta({ ...defaultFormVal })
        // console.log('reset', e)
        e.preventDefault()
    }

    return (
        <div className='center'>
            <h1>quick form check</h1>
            <form ref={form1} className='flex col gap'>
                <input name={labels.text1} type='text' onChange={handleChange} value={meta[labels.text1]} />
                <input name={labels.text2} type='text' onChange={handleChange} value={meta[labels.text2]} />
                <input name={labels.text3} type='text' onChange={handleChange} value={meta[labels.text3]} />
                <div className='row'>
                    <input type='button' value='Submit' onClick={handleSubmit} />
                    <input type='button' value='Reset' onClick={handleReset} />
                </div>
            </form>
        </div>
    )
}
export default QuickForm


