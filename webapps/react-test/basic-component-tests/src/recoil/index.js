import React from 'react'
import {CharCountComponent} from "./CharCountComponent";
import {RecoilRoot} from "recoil";

export default function RecoilCheck(props){
    return <>
        <div>Recoil check - atom and selectors</div>
        <RecoilRoot>
            <CharCountComponent/>
        </RecoilRoot>
    </>
}
