import React, {useState} from "react";
import AppInput from "../common/input";
import ContactList from "./contactList";


const ContactSearch=props=>{
    const [searchValue, setSearchValue]=useState()

    // const txtStyle={
    //     width:'80%'
    // }

    const handleChangeContactSearchBox=(e)=>{
        const val=e.target.value
        setSearchValue(val)
    }

    return <div>
        <h2>contact search</h2>
        <AppInput placeholder={'search...'} onchange={handleChangeContactSearchBox} className={'wid-80'} />
        <ContactList searchValue={searchValue}/>
    </div>
}

export default ContactSearch
