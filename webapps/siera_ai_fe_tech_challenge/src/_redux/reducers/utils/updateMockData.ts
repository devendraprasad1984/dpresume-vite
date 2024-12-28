import ENUMS from "../../../config/enum";
import {EventType, ResponseType, MarketType, ReduxActionTypes} from "../../../config/app-data-types";

export const ModifyMockData = (mockData: ResponseType) => {
    let allMarkets = mockData.filter((x: any) => x.markets.length !== 0)
    let newDataObj = allMarkets.map((row: any) => {
        for (let market of row.markets) {
            let isTeamToWin = (market.name === ENUMS.consts.TeamToWin)
            market["isTeamToWin"] = isTeamToWin
            if (isTeamToWin) market["isSelected"] = 0
        }
        return row
    })
    return newDataObj

}

export const GETSETTeamToWinCount = (data: any[], payload: any) => {
    let newDataObj = [...data]
    let {selId, type}=payload
    for (let evt of newDataObj) {
        let markets = evt.markets as MarketType[]
        for (let mkt of markets) {
            let {selections, isTeamToWin} = mkt
            if (!isTeamToWin) continue

            let matchedSelection = selections.filter(x => x.id === selId)
            if (matchedSelection.length === 0) break
            if (matchedSelection.length === 1)
                if(type==='add')
                    mkt.isSelected = 1
                else if(type==='remove')
                    mkt.isSelected = 0
        }
    }
    return newDataObj
}