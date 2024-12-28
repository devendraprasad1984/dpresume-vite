import React from 'react'
import './App.css';
import Main from "./main";
import {Provider} from 'react-redux'
import store from "./redux/createStore";


function App() {
    return <React.StrictMode>
        <Provider store={store}>
            <Main/>
        </Provider>
    </React.StrictMode>
}

export default App;
