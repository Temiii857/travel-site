import { Link } from "react-router-dom";

export default function NotFound() {
    return (
        <div className="stack">
            <h2>Page not found</h2>
            <p className="muted">That route doesn’t exist.</p>
            <Link className="btn" to="/">Go home</Link>
        </div>
    );
}
