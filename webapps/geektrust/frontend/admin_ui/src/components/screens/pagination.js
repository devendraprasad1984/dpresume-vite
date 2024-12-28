import React from "react";
import {enums} from "../../configs/consts";
import Button from "../common/button";

const Pagination = props => {
    const {numpages, curPageIndex, updatePageIndex} = props

    return <div className='space-around wid100p'>
        <span><Button val='start' onclick={() => updatePageIndex(1)}/></span>
        <span><Button val='prev' onclick={() => updatePageIndex(curPageIndex - 1)}/></span>
        <span><Button val='next' onclick={() => updatePageIndex(curPageIndex + 1)}/></span>
        <span><Button val='end' onclick={() => updatePageIndex(numpages)}/></span>
    </div>
}
export default React.memo(Pagination)
