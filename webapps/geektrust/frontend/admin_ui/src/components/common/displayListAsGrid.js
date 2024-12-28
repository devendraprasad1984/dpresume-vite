import React, {useEffect, useState} from "react";
import Button from "./button";
import Input from "./input";
import {config, formLabels} from "../../configs/consts";

const labels = formLabels.adminLabels
const metaInit = {
    [labels.name]: '',
    [labels.email]: ''
}

const DisplayListAsGrid = props => {
    const {data, onselect, onedit, ondelete, numpages, curPageIndex, header, onSelectAll, pageSearchKeyDown, onsave} = props
    const [editItem, setEditItem] = useState([])
    const [editMeta, setEditMeta] = useState({...metaInit})

    const displayHeader = () => {
        return header.map((row, index) => {
            let {id, name, email, role, checked} = row
            return <div key={'grid-row' + index} className={'line header'}>
                <span style={{minWidth: '30px'}}><Button val='' classname='green' onclick={() => onSelectAll(id)}/></span>
                <span>{name}</span>
                <span style={{minWidth: '250px'}}>{email}</span>
                <span style={{minWidth: '100px'}}>{role}</span>
                <span>{checked}</span>
            </div>
        })
    }
    const handleEdit = (id) => {
        let tmp = config.utils.deepCopy(data).filter(x => x.id === id)
        let tmpItem = {[labels.name]: tmp[0].name, [labels.email]: tmp[0].email}
        onedit(id, true)
        setEditMeta({...editMeta, ...tmpItem})
        setEditItem([...tmp])
    }
    const displayList = () => {
        let {_start, _end} = config.utils.getPageIndex(curPageIndex)
        return data.slice(_start, _end).map((row, index) => {
            let {id, name, email, role, checked, edit} = row
            let selRowClass = checked === true ? ' gray ' : ' '
            let editRowClass = edit === true ? ' purple ' : ' '
            return <div key={'grid-row' + index} className={'line size12 ' + editRowClass + selRowClass}>
                <span style={{minWidth: '30px'}}>
                    <Input classname='checkbox' type='checkbox' onchange={(e) => onselect(e, id)} checked={checked}/>
                </span>
                <span>{name}</span>
                <span style={{minWidth: '250px'}}>{email}</span>
                <span style={{minWidth: '100px'}}>{role}</span>
                <span className='pad'>
                        <Button classname={edit === true ? 'green' : ''} val={'edit'} onclick={() => handleEdit(id)}/>
                        <Button classname='red' val='delete' onclick={() => ondelete(id)}/>
                </span>
                <span>{checked}</span>
            </div>
        })
    }
    const handleItemSave = (id) => {
        onsave(id, editMeta, (status) => {
            if (status === 'success') {
                onedit(id, false)
                setEditItem([])
            }
        })
    }
    const handleItemCancel = (id) => {
        setEditItem([])
        onedit(id, false)
    }

    const changeEditMeta = (e) => {
        let tmp = {...editMeta}
        let name = e.target.name
        let value = e.target.value
        tmp[name] = value
        setEditMeta({...tmp})
    }

    const showRightEditPanel = () => {
        if (editItem.length === 0) return
        let {id, name, email, role} = editItem[0]
        return <div className='col'>
            <h3 className='xred'>Editing {id}, role: {role}</h3>
            <div className='v-space'>
                <Input name={labels.name} label={labels.name} value={editMeta[labels.name]} onchange={changeEditMeta}/>
                <Input name={labels.email} label={labels.email} value={editMeta[labels.email]} onchange={changeEditMeta}/>
            </div>

            <div className='row pad'>
                <span><Button classname='green' val='Save' onclick={() => handleItemSave(id)}/></span>
                <span><Button classname='red' val='Cancel' onclick={() => handleItemCancel(id)}/></span>
            </div>
        </div>
    }

    return <div className=''>
        <div className='atright bl row pad'>
            <span>found: {data.length}</span>
            <span>page: {curPageIndex} / {numpages}</span>
            <span>
                <Input placeholder='jump to page' style={{width: '100px'}} inputInOneLine={true} onkeydown={pageSearchKeyDown}/>
            </span>
        </div>
        {displayHeader()}
        <div className='row wid100p'>
            <div className='height400 table col wid80p'>{displayList()}</div>
            <div className='bl xymargin hwmargin wid20p'>{showRightEditPanel()}</div>
        </div>
    </div>
}
export default React.memo(DisplayListAsGrid)
