import React, {useEffect, useState} from 'react'
import {GET_API_HOOK} from "../configs/api";

export default function useInAppAPI({url}) {
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState([])

    useEffect(async () => {
        setLoading(true)
        const data = await GET_API_HOOK(url)
        // console.log('data from api', data)
        setData(data)
        setLoading(false)
    }, [])
    return {data, loading}
}
