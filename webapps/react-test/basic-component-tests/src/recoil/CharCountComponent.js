import React from 'react'
import {useRecoilState, useRecoilValue} from 'recoil'
import {charAtom} from "./atom";
import {CharCountGETComponent} from "./CharCountGETComponent";
import CharCountSelector from "./selector";

export const CharCountComponent = props => {
    const [textCount, setTextCount] = useRecoilState(charAtom)
    return <>
        <div>
            <input type="text" onChange={e => setTextCount(e.target.value.length)}/>
            {/*<span>Character Count: {textCount}</span>*/}
            <CharCountGETComponent/>
            <h2>This is via recoil selector: {useRecoilValue(CharCountSelector)}</h2>
        </div>
    </>
}
