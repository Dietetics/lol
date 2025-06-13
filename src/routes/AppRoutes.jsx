import { Routes, Route } from "react-router-dom";
import Timeline from "../pages/Timeline";
import Milestone from "../pages/Milestone";
import Rules from "../pages/Rules";
import Personnel from "../pages/Personnel";
import Player from "../pages/Player";
import FantasyScene from "../pages/Fantasy-scene";

export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<FantasyScene />} />
            <Route path="/timeline" element={<Timeline />} />
            <Route path="/milestone" element={<Milestone />} />
            <Route path="/rules" element={<Rules />} />
            <Route path="/personnel" element={<Personnel />} />
            <Route path="/player" element={<Player />} />
            <Route path="/fantasy-scene" element={<FantasyScene />} />
        </Routes>
    );
}