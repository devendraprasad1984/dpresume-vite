import Modalify from "../common/modal";
import Button from "../common/Button";
import Progress from "../common/progress";
import Input from "../common/textInput";
import Select from "../common/select";
import OnOff from "../common/switch";
import React, {createRef, useState} from "react";
import GridX from "../common/gridx";


const data = [
    {id: 1, lastName: 'Snow', firstName: 'Jon', age: 35},
    {id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 42},
    {id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 45},
    {id: 4, lastName: 'Stark', firstName: 'Arya', age: 16},
    {id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null},
    {id: 6, lastName: 'Melisandre', firstName: null, age: 150},
    {id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44},
    {id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36},
    {id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65},
];

const HomeUIForm = props => {
    const [modal, setModal] = useState(false)
    const [modal2, setModal2] = useState(false)
    const [isload, setIsload] = useState(false)
    const [checkedOnOff, setCheckedOnOff] = useState(false)
    const name = createRef()
    const selnum = createRef()
    const date = createRef()
    const seldate = createRef()
    const remarks = createRef()
    const onoff = createRef()

    return <div>
        <Modalify header={'Alert!!!'} text={"Your Data has been saved"} state={modal} callback={(x) => setModal(x)}/>
        <Modalify state={modal2} header={'hello world'} callback={(x) => setModal2(x)}>
            <span>World!!!</span>
        </Modalify>
        <div className='inrow'>
            <Button val={'modal1'} click={() => setModal(true)}/>
            <Button val={'modal2'} click={() => setModal2(true)}/>
            <Button val={'stop load'} click={() => setIsload(!isload)}/>
        </div>
        <Progress loader={isload}/>
        <h2>Fill Form Completely...</h2>
        <div className='wid50'>
            <Input ref={name} label='Enter Name'/>
            <Input ref={date} label='date' type='date'/>
            <Input ref={remarks} label='remarks' type='area'/>
            <Select ref={seldate} label='choose dates' data={['one', 'two', 'three']}/>
            <Select ref={selnum} label='choose..' data={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}/>
            <OnOff ref={onoff} label='permanent?' checked={checkedOnOff} toggle={() => setCheckedOnOff(!checkedOnOff)}/>
            {/*<Input type='checkbox' ref={onoff} label='permanent?'/>*/}
            <Button val='save' color='btn green' click={() => {
                console.log(selnum.current.value
                    , name.current.value
                    , date.current.value
                    , seldate.current.value
                    , remarks.current.value
                    , checkedOnOff)
            }}/>
        </div>
        <div>
            <GridX data={data} edit={(row)=>{console.log(row)}}/>
        </div>
    </div>
}
export default HomeUIForm
