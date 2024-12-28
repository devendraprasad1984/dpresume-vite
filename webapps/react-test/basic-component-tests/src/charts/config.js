export const getMarks = (x, i) => ({
    ival: i,
    value: x,
    label: <span key={'label-' + x + i} className='markLabel markLabel90'>{x}</span>
})

export const getYrs = (start, end) => {
    let yrsArr = []
    for (let i = start; i <= end; i++) {
        yrsArr.push(i)
    }
    return yrsArr
}

export const getQtrs = (start, end) => {
    let yrsArr = []
    let qtrs = ['Q1', 'Q2', 'Q3', 'Q4']
    for (let i = start; i <= end; i++) {
        for (let j of qtrs)
            yrsArr.push(i.toString() + j.toString())
    }
    return yrsArr
}

export const getMarkIndex = (marks, val) => {
    let found = -1
    for (let i = 0; i < marks.length; i++) {
        if (marks[i] === val) {
            found = i
            break
        }
    }
    return found
}

export const getUpdatedDataByRange=(data,start,end)=>{
    let tmp=[]
    // console.log(start,end, data)
    for(let i=start; i<end; i++){
        tmp.push(data[i])
    }
    return tmp
}
