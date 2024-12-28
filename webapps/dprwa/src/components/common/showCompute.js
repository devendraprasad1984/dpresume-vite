import React from 'react'
import PropTypes from "prop-types";

export default function ShowCompute(props) {
    const {time, loadTime} = props

    if (time === undefined && loadTime === undefined) return null
    return (
        <div className='right'>
            fetched in {time && <span className='xprimary'>{time}ms</span>}
            {loadTime && "rendered in"}
            {loadTime && <span className='xprimary'>{loadTime}ms</span>}
        </div>
    )
}
ShowCompute.propTypes = {
    time: PropTypes.any,
    loadTime: PropTypes.any
}
