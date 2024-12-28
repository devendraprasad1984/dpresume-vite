import React from 'react'

const Input = props => {
    const {type, name, label, style, onchange, onkeydown, placeholder, format, classname, value, checked, inputInOneLine} = props
    const ifDateFormat = format !== undefined ? {"data-date-format": format} : {}
    const isCheckBox = (type === 'checkbox')
    const isChecked = checked === undefined ? false : checked
    let ifPlacehollder = {}
    let ifChecked = {}
    if (placeholder !== undefined) ifPlacehollder = {"placeholder": placeholder}
    if (isCheckBox) ifPlacehollder = {"value": placeholder}
    if (isCheckBox) ifChecked = {"checked": isChecked}

    let baseInputProps = {
        onChange: onchange,
        onKeyDown: onkeydown,
        name: name || '',
        type: type || 'text',
        className: classname || '',
        value: value
    }

    let inputObj = <input {...baseInputProps} {...ifDateFormat} {...ifPlacehollder} {...ifChecked} />
    return <div className={inputInOneLine === true ? '' : 'col'}>
        {isCheckBox || inputInOneLine === true ? null : <span className='label'>{label}</span>}
        <div className={`row ${!isCheckBox ? 'input-border' : ''}`} style={style}>
            {inputObj}
            {isCheckBox && placeholder !== undefined ? <span className='label'>{placeholder}</span> : null}
        </div>
    </div>
}

export default Input
