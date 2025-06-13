import { useEffect } from "react";
import FantasySceneViewer from "../components/Fantasy-scene-viewer";

export default function FantasyScene() {
    useEffect(() => {
        document.title = "Home";
    }, []);

    return (
        <div
            className="min-vh-100 bg-fantasy-dark"
            style={{
                overflow: "hidden",
                width: "100vw",
                height: "100vh",
                position: "relative",
            }}
        >
            <FantasySceneViewer />
        </div>
    );
}
