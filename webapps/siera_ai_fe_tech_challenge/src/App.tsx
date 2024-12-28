import React, {useEffect} from 'react';
import './App.css';
import 'antd/dist/antd.css'
import {useDispatch} from 'react-redux'
import {pullMockData} from "./_redux/api/pull";
import Endpoints from "./config/endpoints";
import Main from "./components/main";
import {BrowserRouter} from "react-router-dom";

// const fetchAtLoad = (dispatch: any) => {
//     console.log('loading data')
//     pullMockData(Endpoints.mockUrl)(dispatch)
// }

function App() {
    const dispatch = useDispatch()
    // fetchAtLoad(dispatch)
    useEffect(() => {
        if ('requestIdleCallback' in window) {
            // Use requestIdleCallback to schedule work. doesnt gurantee of code run
            window.requestIdleCallback(() => pullMockData(Endpoints.mockUrl)(dispatch))
        } else {
            //deferred callback, run calcs or pulls in separate thread than main thread
            setTimeout(() => {
                pullMockData(Endpoints.mockUrl)(dispatch)
            }, 50)
        }
        return () => {
            console.log('app is unmounting, some cleanup/log info if required may go here')
        }
    }, [])
    return (
        <div className="App">
            <h1>bet easy app</h1>
            <div className='handwritting'>completed by devendraprasad1984@gmail.com, +91 9582797772</div>
            <BrowserRouter>
                <Main/>
            </BrowserRouter>
        </div>
    );
}

export default React.memo(App);
