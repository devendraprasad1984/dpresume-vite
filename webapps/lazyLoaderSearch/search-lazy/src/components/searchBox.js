import React, {useCallback, useEffect, useRef, useState} from 'react'
import getData from "../common/getFromApi";
import debounce from '../common/debounce'

export default function SearchBox(props) {
    const [query, setQuery] = useState('')
    const [page, setPage] = useState(1)
    const [data, setData] = useState([])
    const [pageLoadingStatus, setPageLoadingStatus] = useState(false)
    const [error, setError] = useState(false)
    const [hasMoreData, setHasMoreData] = useState(true)
    const [txtSearch, setTxtSearch] = useState('')

    // useEffect(() => {
    //     setData([])
    // }, [query])


    const fetchData = () => {
        if (query === '') {
            setData([])
            return
        }
        setPageLoadingStatus(true)
        let url = `https://openlibrary.org/search.json?q=${query}&page=${page}`
        let handleData = data => {
            if (data.error !== undefined) {
                setError(data.error)
                return
            }
            let uniqTitles = [...new Set(data.docs.map(x => x.title))]
            setData(prevData => [...prevData, ...uniqTitles])
            setPageLoadingStatus(false)
            setHasMoreData(data.docs.length > 0)
        }
        getData(url, handleData)
    }
    useEffect(() => {
        fetchData()
    }, [query, page])

    const observerToLastElement = useRef()
    const lastElementRef = useCallback(node => {
        if (pageLoadingStatus) return
        if (observerToLastElement.current) observerToLastElement.current.disconnect()
        observerToLastElement.current = new IntersectionObserver(els => {
            if (els[0].isIntersecting && hasMoreData) {
                setPage(prevPage => prevPage + 1)
            }
        })
        if (node) observerToLastElement.current.observe(node)
    }, [pageLoadingStatus, hasMoreData])

    const delayedCallback = debounce((e) => setQuery(e.target.value), 1000)

    const handleChange = (e) => {
        let value = e.target.value
        delayedCallback(e)
        setPage(1)
        setTxtSearch(value)
    }

    const handleSubmitClick = (e) => {
        setQuery(e.target.value)
        // setQuery(txtSearch.current.value)
        setPage(1)
    }

    const handleDisplayData = () => {
        if (data.length === 0) return null
        return data.map((title, index) => {
            if (data.length === index + 1)
                return <div key={'rowBooks' + index} ref={lastElementRef}>{index + 1} {title}</div>
            else
                return <div key={'rowBooks' + index}>{index + 1} {title}</div>
        })
    }

    const handleReset = () => {
        setData([])
        setTxtSearch('')
    }

    return (
        <>
            <div className='flex col wid100'>
                <input onChange={handleChange} value={txtSearch}
                       placeholder={'eg enter cars|frog|any random word, when list comes, scroll to load more'}
                       className=''
                />
                <div className='right marginTop10 gap10'>
                    <button onClick={handleSubmitClick}>Submit</button>
                    <button onClick={handleReset} className='danger'>Reset</button>
                </div>
            </div>
            <div>{handleDisplayData()}</div>

            {pageLoadingStatus && <div><h1>please wait...</h1></div>}
            {error && <div>{error}</div>}

        </>
    )
}
