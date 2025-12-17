import { useMemo, useState } from "react";
import { destinations } from "../data/destinations.js";

const LS_KEY = "dreamTrip_v2";

/* I used these two websites to help me with localStorage:
https://www.w3schools.com/js/js_api_web_storage.asp
https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage */

const months = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December"
];

const vibes = ["Soft life","Adventure","Food tour","Shopping","Nature","Culture"];

function uid() {
    return (crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`);
}

function makeEmptyDay(n) {
    return {
        id: uid(),
        title: `Day ${n}`,
        morning: "",
        afternoon: "",
        evening: "",
        notes: "",
    };
}

function defaultPlan(destinationOptions) {
    return {
        name: "Temi",
        destination: destinationOptions[0] || "",
        month: "June",
        budget: "",
        vibe: "Soft life",

        flight: {
            from: "",
            to: "",
            depart: "",
            return: "",
            airline: "",
            confirmation: "",
        },

        stay: {
            hotel: "",
            address: "",
            transport: "",
            checkIn: "",
            checkOut: "",
        },

        packing: {
            mustHaves: "",
            outfits: "",
            docs: "",
        },

        itinerary: [makeEmptyDay(1), makeEmptyDay(2)],
        savedAt: null,
    };
}

export default function Planner() {
    const destinationOptions = useMemo(() => destinations.map((d) => d.name), []);

    const [plan, setPlan] = useState(() => {
        const fallback = defaultPlan(destinationOptions);

        try {
            const raw = localStorage.getItem(LS_KEY);
            if (!raw) return fallback;

            const parsed = JSON.parse(raw);
            return {
                ...fallback,
                ...parsed,
                flight: { ...fallback.flight, ...(parsed.flight || {}) },
                stay: { ...fallback.stay, ...(parsed.stay || {}) },
                packing: { ...fallback.packing, ...(parsed.packing || {}) },
                itinerary: Array.isArray(parsed.itinerary) && parsed.itinerary.length
                    ? parsed.itinerary
                    : fallback.itinerary,
            };
        } catch (err) {
            console.warn("Planner localStorage read failed:", err);
            return fallback;
        }
    });

    const [justSaved, setJustSaved] = useState(false);

    function update(key, value) {
        setPlan((p) => ({ ...p, [key]: value }));
    }

    function updateNested(section, key, value) {
        setPlan((p) => ({
            ...p,
            [section]: { ...p[section], [key]: value },
        }));
    }

    function updateDay(dayId, key, value) {
        setPlan((p) => ({
            ...p,
            itinerary: p.itinerary.map((d) => (d.id === dayId ? { ...d, [key]: value } : d)),
        }));
    }

    function addDay() {
        setPlan((p) => ({
            ...p,
            itinerary: [...p.itinerary, makeEmptyDay(p.itinerary.length + 1)],
        }));
    }

    function removeDay(dayId) {
        setPlan((p) => {
            const next = p.itinerary.filter((d) => d.id !== dayId);
            const renumbered = next.map((d, i) => ({ ...d, title: `Day ${i + 1}` }));
            return { ...p, itinerary: renumbered.length ? renumbered : [makeEmptyDay(1)] };
        });
    }

    function savePlan() {
        const payload = { ...plan, savedAt: new Date().toISOString() };
        localStorage.setItem(LS_KEY, JSON.stringify(payload));
        setPlan(payload);

        setJustSaved(true);
        window.setTimeout(() => setJustSaved(false), 1200);
    }

    function clearPlan() {
        localStorage.removeItem(LS_KEY);
        setPlan(defaultPlan(destinationOptions));
    }

    return (
        <div className="stack">
            <div className="section-head planner-head">
                <div>
                    <h2>Dream Trip Planner</h2>
                    <p className="muted">Saves to your browser on your computer. No uploads.</p>
                </div>

                <div className="row">
                    <button className="btn primary" type="button" onClick={savePlan}>
                        {justSaved ? "Saved" : "Save plan"}
                    </button>
                    <button className="btn" type="button" onClick={clearPlan}>Clear</button>
                </div>
            </div>

            <div className="planner-grid">
                <section className="planner-col">
                    <div className="planner-card planner-wide">
                        <h3 className="planner-title">Trip details</h3>

                        <div className="planner-fields">
                            <label className="field">
                                <span>Your name</span>
                                <input value={plan.name} onChange={(e) => update("name", e.target.value)} />
                            </label>

                            <label className="field">
                                <span>Destination</span>
                                <select value={plan.destination} onChange={(e) => update("destination", e.target.value)}>
                                    {destinationOptions.map((n) => <option key={n} value={n}>{n}</option>)}
                                </select>
                            </label>

                            <div className="planner-row-2">
                                <label className="field">
                                    <span>Month</span>
                                    <select value={plan.month} onChange={(e) => update("month", e.target.value)}>
                                        {months.map((m) => <option key={m} value={m}>{m}</option>)}
                                    </select>
                                </label>

                                <label className="field">
                                    <span>Budget (USD)</span>
                                    <input
                                        value={plan.budget}
                                        onChange={(e) => update("budget", e.target.value)}
                                        placeholder="e.g. 2000"
                                        inputMode="numeric"
                                    />
                                </label>
                            </div>

                            <label className="field">
                                <span>Trip vibe</span>
                                <select value={plan.vibe} onChange={(e) => update("vibe", e.target.value)}>
                                    {vibes.map((v) => <option key={v} value={v}>{v}</option>)}
                                </select>
                            </label>

                            {plan.savedAt && (
                                <p className="muted" style={{ margin: 0 }}>
                                    Last saved: {new Date(plan.savedAt).toLocaleString()}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="planner-card planner-wide">
                        <h3 className="planner-title">Flight details</h3>

                        <div className="planner-row-2">
                            <label className="field">
                                <span>From</span>
                                <input value={plan.flight.from} onChange={(e) => updateNested("flight", "from", e.target.value)} placeholder="JFK" />
                            </label>

                            <label className="field">
                                <span>To</span>
                                <input value={plan.flight.to} onChange={(e) => updateNested("flight", "to", e.target.value)} placeholder="NRT" />
                            </label>
                        </div>

                        <div className="planner-row-2">
                            <label className="field">
                                <span>Departure</span>
                                <input type="date" value={plan.flight.depart} onChange={(e) => updateNested("flight", "depart", e.target.value)} />
                            </label>

                            <label className="field">
                                <span>Return</span>
                                <input type="date" value={plan.flight.return} onChange={(e) => updateNested("flight", "return", e.target.value)} />
                            </label>
                        </div>

                        <div className="planner-row-2">
                            <label className="field">
                                <span>Airline</span>
                                <input value={plan.flight.airline} onChange={(e) => updateNested("flight", "airline", e.target.value)} placeholder="Delta" />
                            </label>

                            <label className="field">
                                <span>Confirmation #</span>
                                <input value={plan.flight.confirmation} onChange={(e) => updateNested("flight", "confirmation", e.target.value)} placeholder="ABC123" />
                            </label>
                        </div>
                    </div>

                    <div className="planner-card planner-wide">
                        <h3 className="planner-title">Hotel & transportation</h3>

                        <label className="field">
                            <span>Hotel / stay name</span>
                            <input value={plan.stay.hotel} onChange={(e) => updateNested("stay", "hotel", e.target.value)} placeholder="Hotel name" />
                        </label>

                        <label className="field">
                            <span>Address</span>
                            <input value={plan.stay.address} onChange={(e) => updateNested("stay", "address", e.target.value)} placeholder="Street, city" />
                        </label>

                        <div className="planner-row-2">
                            <label className="field">
                                <span>Check-in</span>
                                <input type="date" value={plan.stay.checkIn} onChange={(e) => updateNested("stay", "checkIn", e.target.value)} />
                            </label>

                            <label className="field">
                                <span>Check-out</span>
                                <input type="date" value={plan.stay.checkOut} onChange={(e) => updateNested("stay", "checkOut", e.target.value)} />
                            </label>
                        </div>

                        <label className="field">
                            <span>Transportation plan</span>
                            <input
                                value={plan.stay.transport}
                                onChange={(e) => updateNested("stay", "transport", e.target.value)}
                                placeholder="Taxi, train pass, rental car, etc."
                            />
                        </label>
                    </div>

                    <div className="planner-card planner-wide">
                        <h3 className="planner-title">Packing list</h3>

                        <label className="field">
                            <span>Must-haves</span>
                            <textarea rows={3} value={plan.packing.mustHaves} onChange={(e) => updateNested("packing", "mustHaves", e.target.value)} placeholder="Chargers, meds, skincare..." />
                        </label>

                        <label className="field">
                            <span>Outfits</span>
                            <textarea rows={3} value={plan.packing.outfits} onChange={(e) => updateNested("packing", "outfits", e.target.value)} placeholder="Day 1 fit, dinner fit, shoes..." />
                        </label>

                        <label className="field">
                            <span>Documents</span>
                            <textarea rows={2} value={plan.packing.docs} onChange={(e) => updateNested("packing", "docs", e.target.value)} placeholder="Passport, ID, confirmations..." />
                        </label>
                    </div>
                </section>

                <section className="planner-col">
                    <div className="planner-card planner-wide">
                        <div className="planner-header-row">
                            <h3 className="planner-title">Itinerary</h3>
                            <button className="btn tiny" type="button" onClick={addDay}>+ Add day</button>
                        </div>

                        <div className="itinerary-list">
                            {plan.itinerary.map((day) => (
                                <article className="day-card" key={day.id}>
                                    <div className="day-head">
                                        <h4 className="day-title">{day.title}</h4>
                                        {plan.itinerary.length > 1 && (
                                            <button
                                                className="btn tiny danger"
                                                type="button"
                                                onClick={() => removeDay(day.id)}
                                                title="Remove day"
                                                aria-label="Remove day"
                                            >
                                                ✕
                                            </button>
                                        )}
                                    </div>

                                    <div className="planner-row-2">
                                        <label className="field">
                                            <span>Morning</span>
                                            <input value={day.morning} onChange={(e) => updateDay(day.id, "morning", e.target.value)} placeholder="Breakfast + first stop" />
                                        </label>

                                        <label className="field">
                                            <span>Afternoon</span>
                                            <input value={day.afternoon} onChange={(e) => updateDay(day.id, "afternoon", e.target.value)} placeholder="Main activity" />
                                        </label>
                                    </div>

                                    <label className="field">
                                        <span>Evening</span>
                                        <input value={day.evening} onChange={(e) => updateDay(day.id, "evening", e.target.value)} placeholder="Dinner + night plans" />
                                    </label>

                                    <label className="field">
                                        <span>Notes</span>
                                        <textarea rows={3} value={day.notes} onChange={(e) => updateDay(day.id, "notes", e.target.value)} placeholder="Links, reservations, outfits, reminders..." />
                                    </label>
                                </article>
                            ))}
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}