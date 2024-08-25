import "./styles/main.css";
import "./styles/App.css";

function App() {

    return <div className="flex col space-between main-outer">
        <header className="header border">Header</header>
        <section className="body border flex row gap1 basis space-between">
            <div className="wid10 border">left</div>
            <div className="wid100">center</div>
            <div className="wid20 border">right</div>
        </section>
        <footer className="border footer">footer</footer>
    </div>
}

export default App
