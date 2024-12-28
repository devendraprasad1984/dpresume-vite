import React from "react";
import Endpoints from "../../config/endpoints";
import fetchMock from "jest-fetch-mock";

fetchMock.enableMocks()

let wrapped, res, _data;
let mockdata = {
    data: [
        {
            id: 'EVT_1', name: 'Real Madrid vs Barcelona', markets: [
                {
                    id: 'MKT_1', name: 'Team to Win', selections: [
                        {id: 'SEL_1', name: 'Real Madrid', price: 1.23}
                    ]
                }
            ]
        }
    ]
}
beforeEach(async () => {
    fetch.resetMocks()
    fetch.mockClear()
    fetch.mockResponseOnce(JSON.stringify(mockdata, {status: 200}))
    res = await fetch(Endpoints.mockUrl)
})
afterAll(() => {

})

describe(`checking fetch test ${Endpoints.mockUrl}`, () => {
    it('api response ok', () => expect(res.statusText).toEqual('OK'))
    it('api response status 200', () => expect(res.status).toEqual(200))
    it('api call length', () => expect(fetch.mock.calls.length).toBeGreaterThanOrEqual(1))
    it('calling with', () => expect(fetch).toHaveBeenCalledWith(Endpoints.mockUrl))
    it('checking response', async () => {
        fetch.mockResponseOnce(JSON.stringify(mockdata, {status: 200}))
        _data = await fetch(Endpoints.mockUrl).then(r => r.json())
        expect(_data).toEqual(mockdata);
    })
})