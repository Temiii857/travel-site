import { Routes, Route } from "react-router-dom";
import Layout from "./pages/Layout.jsx";
import Home from "./pages/Home.jsx";
import Destinations from "./pages/Destinations.jsx";
import DestinationDetail from "./pages/DestinationDetail.jsx";
import Planner from "./pages/Planner.jsx";
import NotFound from "./pages/NotFound.jsx";

export default function App() {
    return (
        <Routes>
            <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="destinations" element={<Destinations />} />
                <Route path="destinations/:id" element={<DestinationDetail />} />
                <Route path="planner" element={<Planner />} />
                <Route path="*" element={<NotFound />} />
            </Route>
        </Routes>
    );
}