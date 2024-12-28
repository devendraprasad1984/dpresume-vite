import React from 'react'
import {useRecoilState, useRecoilValue} from "recoil";
import {getSlideDetails} from "../config/helper";
import currentSlideNumber from "../recoil/atom/currentSlideNumber";

const Slide = props => {
    const {page} = props
    const currentSlide = useRecoilValue(currentSlideNumber)
    const slideDetails = getSlideDetails(currentSlide)

    if (slideDetails === undefined) return <div>Fetching, plz wait...</div>

    const {heading, links, text, images} = slideDetails

    return <React.Fragment>
        <h2>{heading}</h2>
        <div className='slideText'>
            {text}
        </div>
        {links &&
        <div className='row'>{links.map((link, i) => <a key={'link' + i} target='_blank' href={link}>{link}</a>)}</div>}
        {images &&
        <div className='row'>{images.map((image, i) => <img key={'img' + i} className='img' src={image}/>)}</div>}
    </React.Fragment>
}

export default Slide