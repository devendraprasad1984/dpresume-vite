import {print, printRecords} from "../utils/print.js";
import {sampledata} from "./sampledata.js";
import {updateDatasetWithCalculations} from "../app/update.js";

const mock = {
    print: jest.fn(),
    printRecords: jest.fn()
}

test('print test -- hello', () => {
    let param = 'hello'
    const act = print(param)
    const exp = mock.print(param)
    expect(exp).toBe(act)
})


test('printRecords with data', () => {
    let printTop = 2
    let dataset = updateDatasetWithCalculations(sampledata)
    const act = printRecords(dataset, printTop)
    const exp = mock.printRecords(dataset, printTop)
    expect(exp).toBe(act)
    // expect(exp).toHaveBeenCalledWith(dataset, printTop)
})

test('printRecords with no data', () => {
    let printTop = 2
    let dataset = updateDatasetWithCalculations()
    const act = printRecords(dataset, printTop)
    const exp = mock.printRecords(dataset, printTop)
    expect(exp).toBe(act)
})

test('printRecords with no data TOHAVEBEENCALLEDWITH', () => {
    let printTop = 2
    let dataset = updateDatasetWithCalculations()
    printRecords(dataset, printTop)
    expect(mock.printRecords).toHaveBeenCalledWith(dataset, printTop)
})
