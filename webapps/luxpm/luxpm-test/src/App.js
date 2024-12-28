import './App.css';
import {BrowserRouter} from "react-router-dom";
import Routes from "./components/route";

function App() {
    return (
        <BrowserRouter>
            <div className="flexbox atcenter">
                <Routes/>
            </div>
        </BrowserRouter>
    );
}

export default App;
