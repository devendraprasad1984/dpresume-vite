import Footer from "./components/footer/footer.jsx";
import Header from "./components/header/header.jsx";
import BodyDesktop from "./components/body/bodyDesktop.jsx";
import useMobile from "./hooks/useMobile.js";
import bodyMobile from "./components/body/bodyMobile.jsx";
import Styles from "./styles.jsx";

function App() {
  const isMobile = useMobile();
  const MainBody = isMobile ? bodyMobile : BodyDesktop;
  return <>
    <Styles/>
    <div className="col space-between main-outer gap1 glass pad10">
      <header className="header"><Header/></header>
      <section className="body flex row mcol gap1 basis space-between wid100">
        <MainBody/>
      </section>
      <footer className="footer"><Footer/></footer>
    </div>
  </>;
}

export default App;
