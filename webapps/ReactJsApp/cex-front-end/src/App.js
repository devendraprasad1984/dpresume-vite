// import logo from './logo.svg';
import './App.css';
import './components/appstyles.css'
import {RoutesComponent} from "./components/routes";
import {BrowserRouter} from 'react-router-dom'
import Header from "./components/screens/header";
import {Provider} from "react-redux";
import {applyMiddleware, combineReducers, createStore} from "redux";
import * as reducers from "./components/redux/reducers";
import thunk from "redux-thunk";

const rootReducer = combineReducers({
    config: reducers.agentReducer
})
const store = createStore(rootReducer, applyMiddleware(thunk))

function App() {
    return <Provider store={store}>
        <BrowserRouter>
            <Header/>
            <RoutesComponent/>
        </BrowserRouter>
    </Provider>
}

export default App;
