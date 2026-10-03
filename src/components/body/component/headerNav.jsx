import {NavLink} from "react-router-dom";
import useTheme from "../../../hooks/useTheme.js";

const navItems = [
  {to: "/", label: "Home"},
  {to: "/about", label: "About"},
  {to: "/projects", label: "Projects"},
  {to: "/apps", label: "Apps"},
  {to: "/js-concepts", label: "JS"}
];

const HeaderNav = () => {
  const {isDark, toggleTheme} = useTheme();

  return <div className="flex row space-between align-center gap5 wid100">
    <ul className="dp-nav">
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
    </ul>

    <button
      type="button"
      onClick={toggleTheme}
      className="dp-theme-toggle anim-fade-down"
      style={{"--stagger": navItems.length + 1}}
      aria-label={`Switch to ${isDark ? "light" : "dark"} theme`}
      title={`Switch to ${isDark ? "light" : "dark"} theme`}
    >
      <span aria-hidden="true">{isDark ? "\u2600\uFE0F" : "\uD83C\uDF19"}</span>
    </button>
  </div>;
};

export default HeaderNav;
