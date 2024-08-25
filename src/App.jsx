import "./styles/root.css";
import "./styles/main.css";
import "./styles/shared.css";
import "./styles/header.css";
import "./styles/body.css";
import "./styles/footer.css";

import Footer from "./components/footer/footer.jsx";
import Header from "./components/header/header.jsx";
import Body from "./components/body/body.jsx";

function App() {
    return <div className="flex col space-between main-outer">
        <header className="header"><Header/></header>
        <section className="body flex row gap1 basis space-between">
            <Body/>
        </section>
        <footer className="footer"><Footer/></footer>
    </div>
}

export default App
