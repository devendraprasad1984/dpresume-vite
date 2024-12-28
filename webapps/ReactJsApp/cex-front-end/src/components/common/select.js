import React from 'react'

const Select = React.forwardRef((props, ref) => {
    const {label, change, data} = props
    const datax = [label,...data] || [label]
    return <div className='cols'>
        <span className='label'>{label}</span>
        <select
            ref={ref}
            type={'select'}
            onChange={change}
        >{datax.map((x, i) => <option key={'opt' + i} value={x}>{x}</option>)}</select></div>
})

export default Select
