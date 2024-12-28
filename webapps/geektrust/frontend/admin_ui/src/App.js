// import logo from './logo.svg';
import './App.css';
import {enums} from "./configs/consts";
import AdminDashboard from "./components/screens/AdminDashboard";

function App() {
    return (
        <div className='atcenter'>
            <div className="app-container">
                <h2>{enums.headings.admin}</h2>
                <AdminDashboard/>
            </div>
        </div>
    );
}

export default App;
