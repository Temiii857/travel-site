import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { destinations } from "../data/destinations.js";

export default function DestinationDetail() {
    const { id } = useParams();
    const destination = destinations.find((d) => d.id === id);

    const [open, setOpen] = useState(false);
    const [active, setActive] = useState("");

    const photoCards = useMemo(() => {
        if (!destination) return [];
        return (destination.images || []).map((src, i) => {
            const fact = destination.funFacts?.[i % destination.funFacts.length] || "";
            return { src, fact, index: i + 1 };
        });
    }, [destination]);

    function openLightbox(src) {
        setActive(src);
        setOpen(true);
    }

    function closeLightbox() {
        setOpen(false);
        setActive("");
    }

    if (!destination) {
        return (
            <div className="stack">
                <h2>Destination not found</h2>
                <Link className="btn" to="/destinations">Back to destinations</Link>
            </div>
        );
    }

    return (
        <div className="stack">
            <Link className="link" to="/destinations">← Back to destinations</Link>

            <section className="detail">

                <img
                    className="detail-img"
                    src={destination.cover || destination.images?.[0]}
                    alt={destination.name}
                />

                <div className="detail-body">
                    <div className="row space">
                        <h2 style={{ margin: 0 }}>{destination.name}</h2>
                        <span className="pill">{destination.region}</span>
                    </div>

                    <p className="lead">{destination.description}</p>

                    <h3>Fun facts</h3>
                    <ul>
                        {destination.funFacts.map((fact) => (
                            <li key={fact}>{fact}</li>
                        ))}
                    </ul>

                    <div className="row">
                        <Link className="btn primary" to="/planner">Plan this trip</Link>
                    </div>
                </div>
            </section>

            <section className="section">
                <div className="section-head">
                    <h3>Photo gallery</h3>
                    <p className="muted">Click a photo to enlarge</p>
                </div>

                <div className="image-grid">
                    {photoCards.map((p) => (
                        <figure
                            key={p.src}
                            className="photo-tile"
                            onClick={() => openLightbox(p.src)}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ") openLightbox(p.src);
                            }}
                            aria-label={`Open photo ${p.index} for ${destination.name}`}
                        >
                            <img src={p.src} alt={`${destination.name} photo ${p.index}`} loading="lazy" />
                            <figcaption className="photo-overlay">
                                <h4>
                                    Photo {p.index}
                                    <span className="pill">{destination.region}</span>
                                </h4>
                                <p>{p.fact}</p>
                            </figcaption>
                        </figure>
                    ))}
                </div>
            </section>

            {open && (
                <div
                    className="lightbox"
                    onClick={closeLightbox}
                    role="dialog"
                    aria-modal="true"
                    aria-label={`${destination.name} image viewer`}
                >
                    <div className="lightbox-card" onClick={(e) => e.stopPropagation()}>
                        <img className="lightbox-img" src={active} alt={`${destination.name} enlarged`} />
                        <div className="lightbox-bar">
                            <strong>{destination.name}</strong>
                            <button className="btn primary" type="button" onClick={closeLightbox}>Close</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}