import category from '../data/bmi_cat.js'
import risks from '../data/bmi_health_risks.js'
import bmi_range from '../data/bmi_range.js'


const getbmiIndex = val => {
    let filtered = bmi_range.map(ranges => {
        if (ranges[1] !== undefined)
            return val > ranges[0] && val < ranges[1]
        else
            return val > ranges[0]
    })
    return filtered.indexOf(true)
}

export const calculateBMI = person => {
    let bmiVal = -1
    let bmiRangeIndex = -1
    let height = person.HeightCm || -1
    let weight = person.WeightKg || -1

    height = height <= 0 ? -1 : height
    weight = weight <= 0 ? -1 : weight

    if (height !== -1 && weight !== -1) {
        let heightM2 = (height * height) / (100 * 100)
        bmiVal = parseFloat((weight / heightM2).toFixed(2))
        if (bmiVal <= 0) bmiVal = -1
        if (bmiVal !== -1) {
            //calculate bmi range index from ranges so that risk/category can be found based on this
            bmiRangeIndex = getbmiIndex(bmiVal)
        }
    }
    return {bmiVal, bmiUnit: 'kg/m2', bmiRangeIndex}
}

export const calculateRisk = bmiRangeIndex => {
    let riskVal = bmiRangeIndex
    if (bmiRangeIndex !== -1) {
        riskVal = risks[bmiRangeIndex]
    }
    return riskVal
}


export const calculateCategory = bmiRangeIndex => {
    let catVal = bmiRangeIndex
    if (bmiRangeIndex !== -1) {
        catVal = category[bmiRangeIndex]
    }
    return catVal
}

export const raw_objects = () => {
    return {category, risks, bmi_range}
}

export const getPeopleByCategory = (dataset, cat_type) => {
    let filterRecords = dataset.filter(x => x.category === cat_type)
    return filterRecords
}
