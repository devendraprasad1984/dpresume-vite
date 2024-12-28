import React from 'react'
import {useRecoilState} from 'recoil'
import {charAtom} from "./atom";

export const CharCountGETComponent = props => {
    const [textCount] = useRecoilState(charAtom)
    return <>
        <div>
            <span>Character GETTER Count: {textCount}</span>
        </div>
    </>
}
