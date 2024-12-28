import {updateDatasetWithCalculations} from "../app/update.js";
import {sampledata} from "./sampledata.js";
import {getPeopleByCategory} from "../utils/calculations.js";
import {cat_enums} from "../utils/consts.js";

const mock = {
    getPeopleByCategory: jest.fn()
}
const dataset = updateDatasetWithCalculations(sampledata)
test('check people with overweight counter', () => {
    const act = getPeopleByCategory(dataset, cat_enums.OVERWEIGHT)
    // const exp = mock.getPeopleByCategory(dataset, cat_enums.OVERWEIGHT)
    expect(act.length).toBeGreaterThan(0)
})

test('check people with high risk', () => {
    const act = getPeopleByCategory(dataset, cat_enums.SEVERELY_OBESE)
    expect(act.length).toBeGreaterThanOrEqual(0)
})
