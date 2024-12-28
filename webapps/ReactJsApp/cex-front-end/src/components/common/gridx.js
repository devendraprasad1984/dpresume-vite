import React, {useEffect, useState} from 'react';
import Input from "./textInput";
import Button from "./Button";

const GridX = (props) => {
    const {data, edit, del} = props
    const [datax, setDatax] = useState([])

    useEffect(() => {
        setDatax(data)
    }, [])

    const noAction = edit === undefined && del === undefined
    const rowAction=(row) => !noAction ? <span>
        {edit !== undefined ? <Button color='badge' val='edit' click={()=>edit(row)}/> : null}
        {del !== undefined ? <Button color='badge red' val='delete' click={()=>del(row)}/> : null}
    </span> : null


    const displayGrid = () => {
        if (datax === undefined || datax.length === 0) return null
        let header = {}
        let tmpKeys = Object.keys(datax[0])
        if (!noAction) tmpKeys = ['act', ...tmpKeys]
        tmpKeys.forEach(x=>header[x]=x.toUpperCase())
        // console.log('header',header)
        const dataWithHeader = [header, ...datax]
        return dataWithHeader.map((x, i) => {
            return <div key={'row' + i} className={i === 0 ? 'line header' : 'line'}>
                {i !== 0 ? rowAction(x) : !noAction ? <span></span> :null}
                <span>{x.id}</span>
                <span>{x.lastName}</span>
                <span>{x.firstName}</span>
                <span>{x.age}</span>
            </div>
        })
    }
    return (
        <div style={{height: 300, width: '100%'}}>
            <div className=''><Input placeholder={'search...'}/></div>
            <div className='table'>{displayGrid()}</div>
        </div>
    );
}
export default GridX
