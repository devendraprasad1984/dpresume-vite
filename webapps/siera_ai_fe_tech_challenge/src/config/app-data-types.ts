export type ResponseType = EventType[]

export type EventType = {
    id: string,
    name: string,
    markets: MarketType[]
}
export type MarketType = {
    id: string,
    name: string,
    selections: SelectionType[]
    isTeamToWin: boolean,
    isSelected: number
}
export type SelectionType = {
    id: string,
    name: string,
    price: number
}

export type BetSlipItemsType = BetItemType[]
export type BetItemType = {
    id: string,
    name?: string,
    price?: number
}
export type ReduxActionTypes={
    type: 'string',
    payload: any
}