import { useEffect } from "react";
import FantasySceneViewer from "../components/fantasy-scene-viewer";

export default function FantasyScene() {
    useEffect(() => {
        document.title = "Fantasy Scene Interactive | Mystical Chamber Explorer";
    }, []);

    return (
        <div className="min-vh-100 bg-fantasy-dark" style={{ overflow: 'hidden' }}>
            <FantasySceneViewer />
        </div>
    );
}
