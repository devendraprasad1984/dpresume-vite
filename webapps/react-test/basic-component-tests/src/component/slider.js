import React, { useEffect, useState } from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Slider from '@material-ui/core/Slider';
import { getMarkIndex } from "../charts/config";

const useStyles = makeStyles({
    root: {
        width: '100%'
    },
});


const MySlider = withStyles({
    root: {
        color: '#4d2784',
        height: 3,
        padding: '13px 0',
    },
    thumb: {
        height: 20,
        width: 20,
        backgroundColor: '#fff',
        border: '1px solid currentColor',
        marginTop: -12,
        marginLeft: -13,
        boxShadow: '#ebebeb 0 2px 2px',
        '&:focus, &:hover, &$active': {
            boxShadow: '#ccc 0 2px 3px 1px',
        },
        '& .bar': {
            // display: inline-block !important;
            height: 5,
            width: 1,
            backgroundColor: 'currentColor',
            marginLeft: 1,
            marginRight: 1,
        },
    },
    active: {},
    track: {
        height: 2,
    },
    rail: {
        color: '#8e8d8d',
        opacity: 1,
        height: 2,
    },
})(Slider);

export default function RangeSlider(props) {
    const { onchange, tickmarks, defaultRange } = props

    const [marks, setMarks] = useState([...tickmarks.map(x => x.ival)])
    const [marksVal, setMarksVal] = useState([...tickmarks.map(x => x.value)])
    // console.log('tickmarks', marks, marksVal)
    const classes = useStyles();
    const defaultValStart = getMarkIndex(marksVal, defaultRange[0])
    const defaultValEnd = getMarkIndex(marksVal, defaultRange[1])

    return (
        <div className={classes.root}>
            <MySlider
                track={'normal'}
                orientation="horizontal"
                // track={true}
                // scale={x => x ** 5}
                defaultValue={[defaultValStart, defaultValEnd]}
                onChangeCommitted={onchange}
                marks={marksVal}
                valueLabelDisplay="auto"
                aria-labelledby="discrete-slider-always"
                getAriaValueText={i => `${i}`}
                getAriaLabel={i => `${i}`}
                min={0}
                max={marks.length - 1}
                valueLabelFormat={i => {
                    return <span key={'label-x-' + i + marksVal[i]} className='sliderLabel bl'>{marksVal[i]}</span>
                }}
                step={1}
            />
        </div>
    );
}
