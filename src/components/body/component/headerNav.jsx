import {NavLink} from "react-router-dom";
import useTheme from "../../../hooks/useTheme.js";

const navItems = [
  {to: "/", label: "Home"},
  {to: "/about", label: "About"},
  {to: "/projects", label: "Projects"},
  {to: "/apps", label: "Apps"},
  {to: "/js-concepts", label: "JS"},
  {to: "/resume", label: "CV.md"}
];

const HeaderNav = () => {
  const {isDark, toggleTheme} = useTheme();

  return <ul className="dp-nav wid100">
    {navItems.map((item, index) => (
      <li key={item.to} className="anim-fade-down" style={{"--stagger": index + 1}}>
        <NavLink
          end={item.to === "/"}
          className={({isActive}) => `nav-link dp-nav__link${isActive ? " active" : ""}`}
          to={item.to}
        >
          {item.label}
        </NavLink>
      </li>
    ))}

    <li className="dp-nav__toggle anim-fade-down" style={{"--stagger": navItems.length + 1}}>
      <button
        type="button"
        onClick={toggleTheme}
        className="dp-theme-toggle"
        aria-label={`Switch to ${isDark ? "light" : "dark"} theme`}
        title={`Switch to ${isDark ? "light" : "dark"} theme`}
      >
        <span aria-hidden="true">{isDark ? "\u2600\uFE0F" : "\uD83C\uDF19"}</span>
      </button>
    </li>
  </ul>;
};

export default HeaderNav;
