import React, {useState} from 'react'
import Input from "./input";
import DisplayList from "./displaylist";
import data from './data.json'

const Combine = props => {
    const [searchData, setSearchData] = useState([])

    const changeCallBack = val => {
        if (val === '') {
            setSearchData([])
            return
        }
        let filterRes = val === '*' ? data : data.filter(row => row.name.toLowerCase().indexOf(val.toLowerCase()) !== -1)
        setSearchData(filterRes)
    }

    return <div>
        <Input change={v => changeCallBack(v)}/>
        <DisplayList data={searchData}/>
    </div>
}

export default Combine
