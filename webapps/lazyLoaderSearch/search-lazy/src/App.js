import './App.css';
import SearchBox from "./components/searchBox";

function App() {
    return (
        <div className="App flex">
            <div className='row'>
                <h2>Lazy Search box</h2>
                <p className='txt-danger'>debounce | observable web api implementation</p>
            </div>
            <p>sample api pull: <a href={"https://openlibrary.org/search.json?q=frog&page=1"}>https://openlibrary.org/search.json?q=frog&page=1</a></p>
            <SearchBox/>
        </div>
    );
}

export default App;
