import React, {useState, useEffect} from 'react'
import SlidesData from '../data/slides'
import '../styles/Slides.css'
import {useRecoilState} from "recoil";
import currentSlideNumber from "../recoil/atom/currentSlideNumber";

const Slides = props => {
    const {children} = props
    let ourSlides = SlidesData
    const [currentSlide, setCurrentSlide] = useRecoilState(currentSlideNumber)
    const [slidesData, setSlidesData] = useState([])

    useEffect(() => {
        setSlidesData(ourSlides)
    }, [ourSlides])

    const handleClick = (val) => {
        switch (val) {
            case "first":
                setCurrentSlide(1)
                return
            case "prev":
                if (currentSlide !== 1)
                    setCurrentSlide(c => c - 1)
                return
            case "next":
                if (currentSlide !== slidesData.length)
                    setCurrentSlide(c => c + 1)
                return
            case "last":
                setCurrentSlide(c => slidesData.length)
                return
            default:
                return
        }
    }

    return <React.Fragment>
        <div className='slides overflow'>
            <h2 className='center'>You are at slide {currentSlide} of {SlidesData.length}</h2>
            <div className='container'>
                {children}
            </div>
        </div>
        <div className='slides center'>
            <div className='buttons'>
                <button onClick={() => handleClick('first')}>First</button>
                <button onClick={() => handleClick('prev')}>Prev</button>
                <button onClick={() => handleClick('next')}>Next</button>
                <button onClick={() => handleClick('last')}>Last</button>
            </div>
        </div>

        {/*<div>slides data: {JSON.stringify(SlidesData)}</div>*/}
    </React.Fragment>
}

export default Slides