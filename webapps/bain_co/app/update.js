import * as calci from "../utils/calculations.js";

export const updateDatasetWithCalculations = (data) => {
    let dataset = (data || [])
    if (dataset.length === 0) return []
    return dataset.map(row => {
        let {bmiVal, bmiUnit, bmiRangeIndex} = calci.calculateBMI(row)
        return {
            ...row, ...{
                bmi: bmiVal,
                bmi_unit: bmiUnit,
                category: calci.calculateCategory(bmiRangeIndex),
                risk: calci.calculateRisk(bmiRangeIndex)
            }
        }
    })
}
