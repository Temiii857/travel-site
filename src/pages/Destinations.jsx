import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { destinations } from "../data/destinations.js";

export default function Destinations() {
    const [query, setQuery] = useState("");
    const [region, setRegion] = useState("All");

    const regions = useMemo(
        () => ["All", ...Array.from(new Set(destinations.map((d) => d.region)))],
        []
    );

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        return destinations.filter((d) => {
            const matchesText =
                !q ||
                d.name.toLowerCase().includes(q) ||
                d.description.toLowerCase().includes(q);

            const matchesRegion = region === "All" ? true : d.region === region;

            return matchesText && matchesRegion;
        });
    }, [query, region]);

    return (
        <div className="stack">
            <div className="section-head">
                <h2>Destinations</h2>

                <div className="row">
                    <input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search destinations…"
                        className="search"
                    />
                    <select value={region} onChange={(e) => setRegion(e.target.value)} className="select">
                        {regions.map((r) => (
                            <option key={r} value={r}>{r}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="grid cards">
                {filtered.map((d) => (
                    <Link key={d.id} to={`/destinations/${d.id}`} className="card">
                        <img src={d.cover || d.images?.[0]} alt={d.name} loading="lazy" />
                        <div className="card-body">
                            <div className="card-top">
                                <h4>{d.name}</h4>
                                <span className="pill">{d.region}</span>
                            </div>
                            <p>{d.description}</p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}