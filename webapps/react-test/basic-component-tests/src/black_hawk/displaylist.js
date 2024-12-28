import React from 'react'

const DisplayList = props => {
    const {data} = props
    const datax = data || []

    const displayList = () => {
        return datax.map(row => {
            return <li key={`item-${row.id}`}>{row.id} - {row.name}</li>
        })
    }
    if (datax.length === 0) return null
    return <div>
        <ul>{displayList()}</ul>
    </div>
}

export default DisplayList
