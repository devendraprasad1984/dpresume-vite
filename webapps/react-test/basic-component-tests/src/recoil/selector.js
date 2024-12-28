import React from 'react'
import {selector} from "recoil";
import {charAtom} from "./atom";


const CharCountSelector=selector({
    key:'CharCountSelector',
    get: ({get})=>{
        const textLength=get(charAtom)
        return textLength
    }
})

export default CharCountSelector