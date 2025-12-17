import { Link } from "react-router-dom";
import { destinations } from "../data/destinations.js";

export default function Home() {
    const featured = destinations.filter((d) =>
        ["tokyo", "jamaica", "cartagena"].includes(d.id)
    );

    return (
        <div className="stack">

            <section className="hero">
                <div className="hero-text">
                    <h2>My dream destinations ✨</h2>

                    <p>
                        This website is a personal travel inspiration project where I show places I would love to visit someday.
                        I share photos and basic information about each place. There is also a planner page where I can write down trip ideas
                        and things I want to do.
                    </p>

                    <div className="row">
                        <Link className="btn primary" to="/destinations">
                            Explore destinations
                        </Link>
                        <Link className="btn" to="/planner">
                            Make a plan
                        </Link>
                    </div>

                    <p className="muted" style={{ margin: 0 }}>
                        Tip: Use the map to zoom, move around, and click pins.
                    </p>
                </div>

                <div className="map-side">
                    <iframe
                        title="Temi Dream Destinations Map"
                        src="https://www.google.com/maps/d/u/0/embed?mid=1SekMD8zhncSiVXCr8jiK-EoPGBWFH-0&ehbc=2E312F&noprof=1"
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                    />
                </div>
            </section>

            <section className="section">
                <div className="section-head">
                    <h3>Featured places</h3>
                    <Link to="/destinations" className="link">
                        See all →
                    </Link>
                </div>

                <div className="grid cards featured-grid">
                    {featured.map((d) => (
                        <Link key={d.id} to={`/destinations/${d.id}`} className="card">
                            <img src={d.images[0]} alt={d.name} loading="lazy" />
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
            </section>
        </div>
    );
}