import "./styles/root.css";
import "./styles/routes.css";
import "./styles/main.css";
import "./styles/center.css";
import "./styles/shared.css";
import "./styles/header.css";
import "./styles/body.css";
import "./styles/footer.css";
import "./styles/mobile.css";

import Footer from "./components/footer/footer.jsx";
import Header from "./components/header/header.jsx";
import Body from "./components/body/body.jsx";

function App() {
    return <div className="col space-between main-outer gap1">
        <header className="header pad5"><Header/></header>
        <section className="body flex row mcol gap1 basis space-between wid100">
            <Body/>
        </section>
        <footer className="footer"><Footer/></footer>
    </div>
}

export default App
