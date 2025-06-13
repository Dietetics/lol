
import { Routes, Route } from "react-router-dom";
import Milestone from "../pages/Milestone";
import Timeline from "../pages/Timeline";
import Personnel from "../pages/Personnel";
import Rules from "../pages/Rules";

export default function GuildRoutes() {
    return (
        <Routes>
            <Route path="/milestone" element={<Milestone />} />
            <Route path="/timeline" element={<Timeline />} />
            <Route path="/personnel" element={<Personnel />} />
            <Route path="/rules" element={<Rules />} />
        </Routes>
    );
}
