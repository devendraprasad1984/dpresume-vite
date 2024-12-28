import React, { useState, useEffect, useRef } from 'react'
import RangeSlider from "../component/slider";
import { getMarkIndex, getUpdatedDataByRange } from "../charts/config";


const d3 = window.d3
const defaultColor='darkgray'

const Chart2 = props => {
    const { name, color, height, width, linesArray, tickmarks, defaultRange } = props
    const [marksVal, setMarksVal] = useState([...tickmarks.map(x => x.value)])
    const [changedData, setChangedData] = useState([])

    const startRangeIndex = getMarkIndex(marksVal, defaultRange[0])
    const endRangeIndex = getMarkIndex(marksVal, defaultRange[1])
    const [qtrRange, setQtrRange] = useState({ start: startRangeIndex, end: endRangeIndex })

    const tickmarksX = getUpdatedDataByRange(tickmarks, startRangeIndex, endRangeIndex)
    const [tickVals, setTickVals] = useState([...tickmarksX.map(x => x.ival)])
    const [showLabel, setShowLabel] = useState(true)
    const [lineData, setLineData] = useState([...linesArray])
    const svgRef = useRef()

    const getX = width => d3.scaleLinear().rangeRound([0, width])
    const getY = height => d3.scaleLinear().rangeRound([height, 0])
    const Tooltip = d3.select(".tooltip_" + name)
    const mouseover = d => Tooltip.style("opacity", 1)
    const mousemove = (d) => {
        let curPos = d3.event
        let pointIndex = Math.round(d[0], 0)
        let val = 'index: ' + pointIndex + '=>' + marksVal[pointIndex] + ',' + Math.round(d[1], 0)
        let x = curPos.pageX + 10
        let y = curPos.pageY + 10
        Tooltip.style("left", x + "px").style("top", y + "px").html(val)
    }
    const mouseleave = d => {
        Tooltip.style("opacity", 0)
    }
    const cleanup = focus => {
        focus.selectAll('g').remove()
        focus.selectAll('.xtrag').remove()
        focus.selectAll('.axis').remove()
        focus.selectAll('.line').remove()
        focus.selectAll('.domain').remove()
        focus.selectAll('.tick').remove()
        focus.selectAll('.points').remove()
        focus.selectAll('.labels').remove()
    }

    const drawlines = (focus, fnObj) => {
        const { lineFn, multilines } = fnObj
        for (let i = 0; i < multilines.length; i++) {
            let { points } = multilines[i]
            focus.append("path")
                .datum(points).attr('class', 'line xline' + i)
                .attr("fill", 'none')
                .attr("stroke", color[i] || defaultColor)
                .attr("stroke-width", 1.5)
                .attr("d", lineFn);
        }
    }
    const drawcircle = (focus, fnObj) => {
        focus.selectAll('.points').remove()
        const { xScaleFn, yScaleFn, dragFn, multilines } = fnObj
        for (let i = 0; i < multilines.length; i++) {
            let { candrag, points } = multilines[i]
            if (candrag !== true) continue
            focus.selectAll('.dots' + i)
                .data(points)
                .enter()
                .append('circle').attr('class', 'points dots' + i)
                .attr('r', 6.0)
                .attr('cx', d => xScaleFn(d[0]))
                .attr('cy', d => yScaleFn(d[1]))
                .style('cursor', 'pointer')
                .style('fill', color[i])
                .on("mouseover", mouseover)
                .on("mousemove", mousemove)
                .on("mousedown", mousemove)
                .on("mouseleave", mouseleave)
                .on("mouseout", mouseleave)
                .call(dragFn)
        }
        if (showLabel === true) drawtextonpoints(focus, fnObj)
    }
    const drawtextonpoints = (focus, fnObj) => {
        focus.selectAll('.xtrag').remove()
        focus.selectAll('.labels').remove()
        const { xScaleFn, yScaleFn, multilines } = fnObj
        for (let i = 0; i < multilines.length; i++) {
            let { candrag, points } = multilines[i]
            if (candrag !== true) continue
            focus.selectAll(".labels" + i)
                .data(points)
                .enter()
                .append('g').attr("class", 'xtrag')
                .append("text").attr("class", 'labels')
                .attr("x", d => xScaleFn(d[0]) - 10)
                .attr("y", d => yScaleFn(d[1]) - 10)
                .text(d => Math.round(d[1], 0))
                .style("fill", color[i])
                .style("font-size", 11)
        }
    }

    const dragstarted = (d) => {
        d3.select(this).raise().classed('active', true);
    }
    const dragged = (d, focus, fnObj) => {
        let { multilines, lineFn, xScaleFn, yScaleFn } = fnObj
        // d[0] = xScaleFn.invert(d3.event.x); //stop dragging horizontal along x-axis
        d[1] = yScaleFn.invert(d3.event.y);
        d3.select(this).attr('cx', xScaleFn(d[0])).attr('cy', yScaleFn(d[1]))
        for (let i = 0; i < multilines.length; i++) {
            let { candrag, data } = multilines[i]
            if (candrag === true) {
                let xval = Math.round(d[0], 0)
                let yval = Math.round(d[1], 0)
                data[xval] = yval
                focus.select('path.xline' + i).attr('d', lineFn);
            }
        }
        drawcircle(focus, fnObj)
    }
    const dragended = (d) => {
        d3.select(this).classed('active', false);
        //get changed indexes and points
        const changed = []
        for (let line of lineData) {
            const tmp = []
            const { candrag } = line
            if (candrag === true) {
                const { data, copy } = line
                for (let index = 0; index < data.length; index++) {
                    // console.log(index,data[index],copy[index])
                    if (data[index] !== copy[index]) {
                        tmp.push({ index, oldVal: copy[index], newVal: data[index] })
                    }
                }
                changed.push(...tmp)
            }
        }
        setChangedData([...changed])
    }
    const drawaxes = (focus, fnObj) => {
        let axisBottomObj = d3.axisBottom(fnObj.xScaleFn).tickFormat(i => marksVal[i])
        focus.append('g').attr('class', 'axis axis--x' + name).attr('transform', 'translate(0,' + fnObj.ht + ')').call(axisBottomObj)
        focus.append('g').attr('class', 'axis axis--y' + name).call(d3.axisLeft(fnObj.yScaleFn))
        // focus.selectAll(`.axis--x${name} text`).attr('transform', 'rotate(90)')
    }

    const alterPointsData = data => {
        let tmp = []
        for (let i = qtrRange.start; i <= qtrRange.end; i++) {
            tmp.push([i, data[i], marksVal[i]])
        }
        // console.log('tmp', tmp, qtrRange)
        return tmp
    }

    const lineChartHandler = () => {
        if (tickVals.length === 0 || tickmarks.length === 0) return

        const svg = d3.select(svgRef.current)
        const margin = { top: 20, right: 20, bottom: 30, left: 50 },
            wid = +svg.attr("width") - margin.left - margin.right,
            ht = +svg.attr("height") - margin.top - margin.bottom;
        let multilines = lineData.map((x, i) => ({ ...x, points: alterPointsData(x.data) }))
        const xScaleFn = getX(wid);
        const yScaleFn = getY(ht)
        let line0 = multilines[0].points
        xScaleFn.domain(d3.extent(line0, d => d[0]));
        yScaleFn.domain(d3.extent(line0, d => d[1]));

        // xScaleFn.domain(d3.extent(line0, d=> d[0]));//numeric
        // yScaleFn.domain(d3.extent(line0, d => d[1]));

        const lineFn = d3.line().x(d => xScaleFn(d[0])).y(d => yScaleFn(d[1])).curve(d3.curveMonotoneX);
        const focus = svg.select('.chart' + name).attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        const fnObj = { multilines, lineFn, xScaleFn, yScaleFn, ht, wid, margin }
        const dragFn = d3.drag().on('start', dragstarted).on('drag', d => dragged(d, focus, fnObj)).on('end', dragended);
        fnObj['dragFn'] = dragFn
        cleanup(focus)
        drawlines(focus, fnObj)
        drawcircle(focus, fnObj)
        drawaxes(focus, fnObj)
    }

    const undoAllChanges = () => {
        let copyLineData = [...lineData]
        let line1 = copyLineData.filter(x => x.name === 'line1')[0]
        if (line1 === undefined || line1.length === 0) return

        line1.data = [...line1.copy]
        // console.log('line1',line1,lineData, copyLineData, changedData)
        setChangedData([])
        setLineData([...copyLineData])
    }

    const handleUndo = index => {
        let upd = changedData.filter(x => x.index !== index)
        setChangedData([...upd])
        let copyLineData = [...lineData]
        // console.log('clicked index', index, copyLineData)
        let line1 = copyLineData.filter(x => x.name === 'line1')[0]
        if (line1 === undefined || line1.length === 0) return

        line1.data[index] = line1.copy[index]
        // console.log('updated', line1.data[index], line1.copy[index])
        setLineData([...copyLineData])
    }

    const displayChanginDataset = () => {
        return changedData.map((x, i) => {
            return <div key={`${name}${i}${x.index}`} className='bl'>
                <span className='xgray'>{i + 1}) {marksVal[x.index]}</span> - <span className='xred'>{x.oldVal}</span> - <span className='xgreen'>{x.newVal}</span>
                <span className='xred point right' onClick={() => handleUndo(x.index)}> X </span>
            </div>
        })
    }

    useEffect(() => {
        lineChartHandler()
    }, [showLabel, qtrRange, lineData])

    const handleTextMode = () => {
        setShowLabel(!showLabel)
    }

    const handleTickChange = (event, v) => {
        let updatedStartQtr = marksVal[v[0]]
        let updatedEndQtr = marksVal[v[1]]
        setQtrRange({ start: v[0], end: v[1], startVal: updatedStartQtr, endVal: updatedEndQtr })
        // console.log(v, updatedStartQtr, updatedEndQtr)
    };

    return (
        <div id={'chartMainDiv' + name} className='chartwrapper center'>
            <div className={"tooltip tooltip_" + name}></div>
            <div className='flex row'>
                <div className='col wid80 xymargin'>
                    <svg ref={svgRef} height={height} width={width} preserveAspectRatio={'xMinYMid'}>
                        <g className={"chart" + name}></g>
                    </svg>
                    <div className='col wid100'>
                        <RangeSlider onchange={handleTickChange} tickmarks={tickmarks} defaultRange={defaultRange} />
                    </div>
                </div>
                <div className='col wid20 border'>
                    <div className='bl'>Watch - {name} <span className='xred right bl size12 point xymargin' onClick={undoAllChanges}>RESET</span></div>
                    <div className='overflow-container height150 left size12'>{displayChanginDataset()}</div>
                </div>
            </div>

            <div className='actioBarChart col'>
                <div>
                    <button onClick={handleTextMode}>show/hide label</button>
                </div>
            </div>
        </div>
    )
}

export default Chart2
