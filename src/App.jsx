import "./styles/main.css";
import "./styles/App.css";
import "./styles/body.css";
import Footer from "./components/footer/footer.jsx";
import Header from "./components/header/header.jsx";
import Body from "./components/body/body.jsx";

function App() {
    return <div className="flex col space-between main-outer">
        <header className="header border"><Header/></header>
        <section className="body border flex row gap1 basis space-between">
            <Body/>
        </section>
        <footer className="border footer"><Footer/></footer>
    </div>
}

export default App
