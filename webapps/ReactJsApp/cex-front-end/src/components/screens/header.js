import React from "react";
import Button from "../common/Button";

const Header = props => {
    const toggle=()=>{
        let leftNav=document.getElementById('mainLeftDiv')
        leftNav.style.display=leftNav.style.display==='none'?'':'none'
    }
    return <div>
        <Button val='' click={toggle} icon='reorder'/>
        <span className='h1'>Core eXpansion</span>
        <span className='right bold'>Welcome, prasadf</span>
    </div>
}
export default Header
