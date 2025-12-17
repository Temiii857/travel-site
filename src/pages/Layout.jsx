import { NavLink, Outlet } from "react-router-dom";

export default function Layout() {
    return (
        <div className="app">
            <header className="topbar">
                <div className="brand">
                    <span className="logo" aria-hidden="true">✈️</span>
                    <div>
                        <h1>Temi’s Dream Destinations</h1>
                    </div>
                </div>

                <nav className="nav" aria-label="Primary navigation">
                    <NavLink to="/" end className={({ isActive }) => (isActive ? "active" : "")}>Home</NavLink>
                    <NavLink to="/destinations" className={({ isActive }) => (isActive ? "active" : "")}>Destinations</NavLink>
                    <NavLink to="/planner" className={({ isActive }) => (isActive ? "active" : "")}>Planner</NavLink>
                    <a href="https://github.com/Temiii857" target="_blank" rel="noopener noreferrer" > GitHub </a>
                </nav>
            </header>

            <main className="content">
                <Outlet />
            </main>

            <footer className="footer">
                <a href="https://example.com">Temi&apos;s Dream Destinations</a> by{" "}
                <a href="https://example.com">Temitope Sakote</a> is marked{" "}
                <a href="https://creativecommons.org/publicdomain/zero/1.0/">CC0 1.0</a>
                <img
                    src="https://mirrors.creativecommons.org/presskit/icons/cc.svg"
                    alt=""
                    style={{ maxWidth: "1em", maxHeight: "1em", marginLeft: ".2em" }}
                />
                <img
                    src="https://mirrors.creativecommons.org/presskit/icons/zero.svg"
                    alt=""
                    style={{ maxWidth: "1em", maxHeight: "1em", marginLeft: ".2em" }}
                />
            </footer>
        </div>
    );
}