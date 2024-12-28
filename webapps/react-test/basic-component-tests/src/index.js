import React from 'react';
import ReactDOM from 'react-dom';
import Root from "./root";
import {BrowserRouter, Route} from "react-router-dom";
import App from './App';


ReactDOM.render(
    <React.StrictMode>
        <Root>
            <BrowserRouter>
                <Route path='/' component={App}/>
            </BrowserRouter>
        </Root>
    </React.StrictMode>,
    document.getElementById('root')
);
