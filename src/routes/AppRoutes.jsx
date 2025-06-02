import { Routes, Route } from "react-router-dom";
import FantasyScene from "../pages/fantasy-scene";

export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<FantasyScene />} />
        </Routes>
    );
}
